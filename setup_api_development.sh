#!/bin/bash

# Step 3: Complete API Development & WebSocket Setup
# This script completes all API endpoints and adds real-time WebSocket functionality

set -e  # Exit on any error

echo "⚡ Step 3: API Development & WebSocket Setup..."

# Navigate to backend directory
if [ ! -d "src" ]; then
    echo "❌ Error: Please run this from the dashboard-project/backend directory"
    exit 1
fi

echo "🔌 Creating WebSocket gateways..."

# Create WebSocket gateway for transactions
cat > src/modules/transactions/transactions.gateway.ts << 'EOF'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TransactionsService } from './transactions.service';
import { RedisService } from '@/redis/redis.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true,
  },
  namespace: '/transactions',
})
export class TransactionsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    // Subscribe to Redis pub/sub for transaction updates
    await this.redisService.subscribe('transactions:new', (transaction) => {
      this.server.emit('transaction:created', transaction);
    });

    await this.redisService.subscribe('transactions:update', (transaction) => {
      this.server.emit('transaction:updated', transaction);
    });
  }

  @SubscribeMessage('transactions:getLatest')
  async handleGetLatest(
    @MessageBody() data: { limit?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const transactions = await this.transactionsService.findLatest(data.limit || 10);
    client.emit('transactions:latest', transactions);
  }

  @SubscribeMessage('transactions:subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket) {
    client.join('transactions-updates');
    client.emit('subscribed', { channel: 'transactions' });
  }

  async broadcastNewTransaction(transaction: any) {
    this.server.emit('transaction:created', transaction);
    await this.redisService.publish('transactions:new', transaction);
  }

  async broadcastTransactionUpdate(transaction: any) {
    this.server.emit('transaction:updated', transaction);
    await this.redisService.publish('transactions:update', transaction);
  }
}
EOF

# Update transactions service with complete functionality
cat > src/modules/transactions/transactions.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { RedisService } from '@/redis/redis.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { DateRangeDto } from '@/common/dto/date-range.dto';

export interface CreateTransactionDto {
  type: string;
  method: string;
  amount: number;
  currency?: string;
  userId: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: createTransactionDto,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Cache the latest transactions
    await this.cacheLatestTransactions();
    
    // Publish to Redis for real-time updates
    await this.redisService.publish('transactions:new', transaction);

    return transaction;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationDto;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count(),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findLatest(limit: number = 10) {
    // Try cache first
    const cacheKey = `transactions:latest:${limit}`;
    const cached = await this.redisService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const transactions = await this.prisma.transaction.findMany({
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Cache for 1 minute
    await this.redisService.set(cacheKey, transactions, 60);
    
    return transactions;
  }

  async getStats(dateRangeDto: DateRangeDto) {
    const whereClause = this.buildDateWhereClause(dateRangeDto);

    const [total, income, expenses, totalAmount] = await Promise.all([
      this.prisma.transaction.count({ where: whereClause }),
      this.prisma.transaction.count({ where: { ...whereClause, type: 'income' } }),
      this.prisma.transaction.count({ where: { ...whereClause, type: 'expense' } }),
      this.prisma.transaction.aggregate({
        where: whereClause,
        _sum: { amount: true },
      }),
    ]);

    const incomeAmount = await this.prisma.transaction.aggregate({
      where: { ...whereClause, type: 'income' },
      _sum: { amount: true },
    });

    const expensesAmount = await this.prisma.transaction.aggregate({
      where: { ...whereClause, type: 'expense' },
      _sum: { amount: true },
    });

    return {
      total,
      income,
      expenses,
      totalAmount: totalAmount._sum.amount || 0,
      incomeAmount: incomeAmount._sum.amount || 0,
      expensesAmount: expensesAmount._sum.amount || 0,
      netAmount: (incomeAmount._sum.amount || 0) - (expensesAmount._sum.amount || 0),
    };
  }

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getStats({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    });
  }

  private async cacheLatestTransactions() {
    const latest = await this.prisma.transaction.findMany({
      take: 20,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    await this.redisService.set('transactions:latest:10', latest.slice(0, 10), 60);
    await this.redisService.set('transactions:latest:20', latest, 60);
  }

  private buildDateWhereClause(dateRangeDto: DateRangeDto) {
    const where: any = {};

    if (dateRangeDto.startDate || dateRangeDto.endDate) {
      where.createdAt = {};
      if (dateRangeDto.startDate) {
        where.createdAt.gte = new Date(dateRangeDto.startDate);
      }
      if (dateRangeDto.endDate) {
        where.createdAt.lte = new Date(dateRangeDto.endDate);
      }
    }

    return where;
  }
}
EOF

# Update transactions controller with complete endpoints
cat > src/modules/transactions/transactions.controller.ts << 'EOF'
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { TransactionsService, CreateTransactionDto } from './transactions.service';
import { TransactionsGateway } from './transactions.gateway';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { DateRangeDto } from '@/common/dto/date-range.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionsGateway: TransactionsGateway,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionsService.create(createTransactionDto);
    
    // Broadcast via WebSocket
    await this.transactionsGateway.broadcastNewTransaction(transaction);
    
    return transaction;
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.transactionsService.findAll(paginationDto);
  }

  @Get('latest')
  async getLatest(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.transactionsService.findLatest(limitNum);
  }

  @Get('stats')
  async getStats(@Query() dateRangeDto: DateRangeDto) {
    return this.transactionsService.getStats(dateRangeDto);
  }

  @Get('today')
  async getTodayStats() {
    return this.transactionsService.getTodayStats();
  }
}
EOF

# Update transactions module to include gateway
cat > src/modules/transactions/transactions.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { RedisModule } from '@/redis/redis.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsGateway } from './transactions.gateway';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsGateway],
  exports: [TransactionsService, TransactionsGateway],
})
export class TransactionsModule {}
EOF

echo "📊 Completing payments service..."

# Complete payments service
cat > src/modules/payments/payments.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { DateRangeDto } from '@/common/dto/date-range.dto';

export interface CreatePaymentDto {
  userId: number;
  method: string;
  amount: number;
  status?: string;
  reference?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        status: createPaymentDto.status || 'pending',
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationDto;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count(),
    ]);

    return {
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats(dateRangeDto: DateRangeDto) {
    const whereClause = this.buildDateWhereClause(dateRangeDto);

    const [total, completed, pending, failed, totalAmount] = await Promise.all([
      this.prisma.payment.count({ where: whereClause }),
      this.prisma.payment.count({ where: { ...whereClause, status: 'completed' } }),
      this.prisma.payment.count({ where: { ...whereClause, status: 'pending' } }),
      this.prisma.payment.count({ where: { ...whereClause, status: 'failed' } }),
      this.prisma.payment.aggregate({
        where: { ...whereClause, status: 'completed' },
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      failed,
      totalAmount: totalAmount._sum.amount || 0,
    };
  }

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getStats({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    });
  }

  private buildDateWhereClause(dateRangeDto: DateRangeDto) {
    const where: any = {};

    if (dateRangeDto.startDate || dateRangeDto.endDate) {
      where.createdAt = {};
      if (dateRangeDto.startDate) {
        where.createdAt.gte = new Date(dateRangeDto.startDate);
      }
      if (dateRangeDto.endDate) {
        where.createdAt.lte = new Date(dateRangeDto.endDate);
      }
    }

    return where;
  }
}
EOF

# Update payments controller
cat > src/modules/payments/payments.controller.ts << 'EOF'
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PaymentsService, CreatePaymentDto } from './payments.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { DateRangeDto } from '@/common/dto/date-range.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.paymentsService.findAll(paginationDto);
  }

  @Get('stats')
  async getStats(@Query() dateRangeDto: DateRangeDto) {
    return this.paymentsService.getStats(dateRangeDto);
  }

  @Get('today')
  async getTodayStats() {
    return this.paymentsService.getTodayStats();
  }
}
EOF

echo "🔧 Creating KPI endpoint..."

# Create KPI controller for dashboard summary data
cat > src/common/kpi.controller.ts << 'EOF'
import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from '@/modules/orders/orders.service';
import { PaymentsService } from '@/modules/payments/payments.service';
import { RevenueService } from '@/modules/revenue/revenue.service';
import { TransactionsService } from '@/modules/transactions/transactions.service';
import { UsersService } from '@/modules/users/users.service';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('kpis')
export class KpiController {
  constructor(
    private ordersService: OrdersService,
    private paymentsService: PaymentsService,
    private revenueService: RevenueService,
    private transactionsService: TransactionsService,
    private usersService: UsersService,
  ) {}

  @Get()
  async getDashboardKpis(@Query() dateRangeDto: DateRangeDto) {
    const [
      orderStats,
      paymentStats,
      transactionStats,
      userStats,
      revenueData,
    ] = await Promise.all([
      this.ordersService.getTodayStats(),
      this.paymentsService.getTodayStats(),
      this.transactionsService.getTodayStats(),
      this.usersService.getStats(),
      this.revenueService.getRevenueByYear(new Date().getFullYear()),
    ]);

    return {
      orders: {
        total: orderStats.total,
        completed: orderStats.completed,
        pending: orderStats.pending,
        totalAmount: orderStats.totalAmount,
      },
      payments: {
        total: paymentStats.total,
        completed: paymentStats.completed,
        totalAmount: paymentStats.totalAmount,
      },
      transactions: {
        total: transactionStats.total,
        income: transactionStats.income,
        expenses: transactionStats.expenses,
        netAmount: transactionStats.netAmount,
      },
      users: userStats,
      revenue: {
        total: revenueData.total,
        monthly: revenueData.data,
      },
    };
  }

  @Get('today')
  async getTodayKpis() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getDashboardKpis({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    });
  }
}
EOF

# Update app module to include KPI controller
cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RevenueModule } from './modules/revenue/revenue.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ProductsModule } from './modules/products/products.module';
import { ReportsModule } from './modules/reports/reports.module';
import { KpiController } from './common/kpi.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    UsersModule,
    OrdersModule,
    RevenueModule,
    PaymentsModule,
    TransactionsModule,
    ProductsModule,
    ReportsModule,
  ],
  controllers: [AppController, KpiController],
  providers: [AppService],
})
export class AppModule {}
EOF

echo "📈 Creating complete products service..."

# Complete products service
cat > src/modules/products/products.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

export interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto?: PaginationDto) {
    if (!paginationDto) {
      return this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const { page, limit, skip } = paginationDto;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });
  }

  async getStats() {
    const [total, categories, lowStock] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      this.prisma.product.count({
        where: { stock: { lte: 10 } },
      }),
    ]);

    return {
      total,
      categories: categories.map(c => ({
        category: c.category,
        count: c._count.category,
      })),
      lowStock,
    };
  }
}
EOF

# Update products controller
cat > src/modules/products/products.controller.ts << 'EOF'
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductsService, CreateProductDto } from './products.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('stats')
  async getStats() {
    return this.productsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
EOF

echo "📋 Creating reports service..."

# Complete reports service
cat > src/modules/reports/reports.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getProfileReport(year?: number) {
    const targetYear = year || new Date().getFullYear();
    
    let profileReport = await this.prisma.profileReport.findUnique({
      where: { year: targetYear },
    });

    // If no report exists, generate it
    if (!profileReport) {
      profileReport = await this.generateProfileReport(targetYear);
    }

    return profileReport;
  }

  async generateProfileReport(year: number) {
    // Get revenue for current and previous year
    const [currentYearRevenue, previousYearRevenue] = await Promise.all([
      this.prisma.revenue.aggregate({
        where: { year },
        _sum: { amount: true },
      }),
      this.prisma.revenue.aggregate({
        where: { year: year - 1 },
        _sum: { amount: true },
      }),
    ]);

    const currentTotal = currentYearRevenue._sum.amount || 0;
    const previousTotal = previousYearRevenue._sum.amount || 0;

    const growthPercentage = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

    // Create or update the profile report
    const profileReport = await this.prisma.profileReport.upsert({
      where: { year },
      update: {
        growthPercentage,
        totalRevenue: currentTotal,
      },
      create: {
        year,
        growthPercentage,
        totalRevenue: currentTotal,
      },
    });

    return profileReport;
  }

  async getDashboardSummary() {
    const currentYear = new Date().getFullYear();
    
    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      profileReport,
    ] = await Promise.all([
      this.prisma.revenue.aggregate({
        where: { year: currentYear },
        _sum: { amount: true },
      }),
      this.prisma.order.count(),
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.getProfileReport(currentYear),
    ]);

    return {
      revenue: totalRevenue._sum.amount || 0,
      orders: totalOrders,
      users: totalUsers,
      products: totalProducts,
      growthPercentage: profileReport.growthPercentage,
      year: currentYear,
    };
  }
}
EOF

# Update reports controller
cat > src/modules/reports/reports.controller.ts << 'EOF'
import { Controller, Get, Query, Post, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('profile')
  async getProfileReport(@Query('year') year?: string) {
    const yearNum = year ? parseInt(year) : undefined;
    return this.reportsService.getProfileReport(yearNum);
  }

  @Get('dashboard-summary')
  async getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  @Post('generate/:year')
  async generateReport(@Param('year') year: string) {
    return this.reportsService.generateProfileReport(parseInt(year));
  }
}
EOF

echo "🌱 Enhancing database seed with more realistic data..."

# Enhanced seed file with more data
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting enhanced database seed...');

  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.revenue.deleteMany();
  await prisma.profileReport.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@dashboard.com',
        role: 'admin',
        avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@dashboard.com',
        role: 'manager',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ec4899&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@dashboard.com',
        role: 'user',
        avatarUrl: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=10b981&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Brown',
        email: 'alice@dashboard.com',
        role: 'user',
        avatarUrl: 'https://ui-avatars.com/api/?name=Alice+Brown&background=f59e0b&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Wilson',
        email: 'charlie@dashboard.com',
        role: 'manager',
        avatarUrl: 'https://ui-avatars.com/api/?name=Charlie+Wilson&background=ef4444&color=fff',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample products with categories
  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
        name: 'MacBook Pro 16"',
        category: 'Electronics',
        price: 2499.99,
        stock: 25,
        imageUrl: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=MacBook',
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        price: 1199.99,
        stock: 150,
        imageUrl: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=iPhone',
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPad Air',
        category: 'Electronics',
        price: 749.99,
        stock: 80,
        imageUrl: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=iPad',
      },
    }),
    // Office
    prisma.product.create({
      data: {
        name: 'Ergonomic Office Chair',
        category: 'Office',
        price: 299.99,
        stock: 45,
        imageUrl: 'https://via.placeholder.com/300x300/374151/ffffff?text=Chair',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Standing Desk',
        category: 'Office',
        price: 499.99,
        stock: 20,
        imageUrl: 'https://via.placeholder.com/300x300/374151/ffffff?text=Desk',
      },
    }),
    // Accessories
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 79.99,
        stock: 200,
        imageUrl: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Mouse',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard',
        category: 'Accessories',
        price: 149.99,
        stock: 75,
        imageUrl: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Keyboard',
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create sample revenue data for current and previous year
  const currentYear = new Date().getFullYear();
  const revenueData = [];
  
  // Previous year revenue
  for (let month = 1; month <= 12; month++) {
    const amount = Math.floor(Math.random() * 40000) + 20000;
    revenueData.push({
      year: currentYear - 1,
      month,
      date: new Date(currentYear - 1, month - 1, 1),
      amount,
    });
  }
  
  // Current year revenue (higher amounts to show growth)
  for (let month = 1; month <= 12; month++) {
    const amount = Math.floor(Math.random() * 60000) + 30000;
    revenueData.push({
      year: currentYear,
      month,
      date: new Date(currentYear, month - 1, 1),
      amount,
    });
  }

  await prisma.revenue.createMany({
    data: revenueData,
  });

  console.log(`✅ Created ${revenueData.length} revenue records`);

  // Create sample orders with varied dates
  const orders = [];
  const statuses = ['pending', 'completed', 'cancelled'];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const createdDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    
    orders.push({
      userId: user.id,
      productId: product.id,
      quantity,
      totalAmount: Math.round(product.price * quantity * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: createdDate,
      updatedAt: createdDate,
    });
  }

  // Use Prisma's createMany for bulk insert
  await prisma.$executeRaw`
    INSERT INTO orders ("userId", "productId", quantity, "totalAmount", status, "createdAt", "updatedAt")
    VALUES ${orders.map((order, index) => 
      `(${order.userId}, ${order.productId}, ${order.quantity}, ${order.totalAmount}, '${order.status}', '${order.createdAt.toISOString()}', '${order.updatedAt.toISOString()}')`
    ).join(', ')}
  `;

  console.log(`✅ Created ${orders.length} orders`);

  // Create sample payments
  const payments = [];
  const paymentMethods = ['credit_card', 'paypal', 'stripe', 'bank_transfer'];
  const paymentStatuses = ['pending', 'completed', 'failed'];
  
  for (let i = 0; i < 30; i++) {
    const createdDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const user = users[Math.floor(Math.random() * users.length)];
    
    payments.push({
      userId: user.id,
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      amount: Math.round((Math.random() * 500 + 50) * 100) / 100,
      status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      reference: `PAY-${Date.now()}-${i}`,
      createdAt: createdDate,
      updatedAt: createdDate,
    });
  }

  for (const payment of payments) {
    await prisma.payment.create({
      data: payment,
    });
  }

  console.log(`✅ Created ${payments.length} payments`);

  // Create sample transactions
  const transactions = [];
  const transactionTypes = ['income', 'expense', 'transfer'];
  const transactionMethods = ['paypal', 'wallet', 'transfer', 'cash'];
  
  for (let i = 0; i < 40; i++) {
    const createdDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const user = users[Math.floor(Math.random() * users.length)];
    
    transactions.push({
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
      method: transactionMethods[Math.floor(Math.random() * transactionMethods.length)],
      amount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
      currency: 'USD',
      userId: user.id,
      createdAt: createdDate,
      updatedAt: createdDate,
    });
  }

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log(`✅ Created ${transactions.length} transactions`);

  // Create profile reports for previous and current year
  const prevYearRevenue = revenueData.filter(r => r.year === currentYear - 1).reduce((sum, r) => sum + r.amount, 0);
  const currentYearRevenue = revenueData.filter(r => r.year === currentYear).reduce((sum, r) => sum + r.amount, 0);
  const growthPercentage = prevYearRevenue > 0 ? ((currentYearRevenue - prevYearRevenue) / prevYearRevenue) * 100 : 0;

  await prisma.profileReport.createMany({
    data: [
      {
        year: currentYear - 1,
        growthPercentage: 0,
        totalRevenue: prevYearRevenue,
      },
      {
        year: currentYear,
        growthPercentage: Math.round(growthPercentage * 100) / 100,
        totalRevenue: currentYearRevenue,
      },
    ],
  });

  console.log(`✅ Created profile reports`);
  console.log(`💰 Total revenue ${currentYear - 1}: $${prevYearRevenue.toLocaleString()}`);
  console.log(`💰 Total revenue ${currentYear}: $${currentYearRevenue.toLocaleString()}`);
  console.log(`📈 Growth: ${Math.round(growthPercentage * 100) / 100}%`);
  console.log('🎉 Enhanced database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

echo ""
echo "✅ Step 3: Complete API Development & WebSocket Setup Complete!"
echo ""
echo "📦 What was enhanced:"
echo "   ✅ WebSocket gateway for real-time transactions"
echo "   ✅ Complete transaction service with caching"
echo "   ✅ Enhanced payments service with full CRUD"
echo "   ✅ KPI controller for dashboard aggregated data"
echo "   ✅ Complete products service with stats"
echo "   ✅ Reports service with growth calculations"
echo "   ✅ Enhanced database seed with realistic data"
echo ""
echo "🧪 Test the enhanced API:"
echo "   1. Reseed database: npm run prisma:seed"
echo "   2. Start backend: npm run start:dev"
echo ""
echo "🌐 New API endpoints available:"
echo "   • GET  /api/kpis - Dashboard KPI summary"
echo "   • GET  /api/kpis/today - Today's KPIs"
echo "   • POST /api/transactions - Create transaction"
echo "   • GET  /api/transactions/latest - Latest transactions"
echo "   • GET  /api/transactions/stats - Transaction statistics"
echo "   • POST /api/payments - Create payment"
echo "   • GET  /api/payments/stats - Payment statistics"
echo "   • GET  /api/products/stats - Product statistics"
echo "   • GET  /api/reports/profile - Profile report"
echo "   • GET  /api/reports/dashboard-summary - Dashboard summary"
echo ""
echo "🔌 WebSocket endpoints:"
echo "   • ws://localhost:4000/transactions - Real-time transaction updates"
echo ""
echo "🚀 Ready for Step 4: Frontend Development"