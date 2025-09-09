#!/bin/bash

# Step 2: Backend Core Development
# This script creates the NestJS application core with all essential services

set -e  # Exit on any error

echo "🔧 Step 2: Setting up Backend Core..."

# Navigate to project directory (assume we're in dashboard-project)
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this from the dashboard-project directory"
    echo "Expected structure: dashboard-project/backend/"
    exit 1
fi

cd backend

echo "📦 Creating NestJS core files..."

# Create TypeScript configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
EOF

# Create NestJS CLI configuration
cat > nest-cli.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
EOF

# Create main.ts - Application entry point
cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://frontend:3000',
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 4000);
  await app.listen(port);

  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📊 API available at: http://localhost:${port}/api`);
}

bootstrap();
EOF

# Create main app module
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
EOF

# Create app controller
cat > src/app.controller.ts << 'EOF'
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'dashboard-backend',
    };
  }
}
EOF

# Create app service
cat > src/app.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Dashboard API is running! 🚀';
  }
}
EOF

# Create Prisma database service
mkdir -p src/database
cat > src/database/prisma.service.ts << 'EOF'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('🗄️  Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🗄️  Database disconnected');
  }
}
EOF

cat > src/database/database.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
EOF

# Create Redis service
mkdir -p src/redis
cat > src/redis/redis.service.ts << 'EOF'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    this.client = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
    this.publisher = new Redis(redisUrl);
  }

  async onModuleInit() {
    this.client.on('connect', () => {
      console.log('🔴 Redis connected successfully');
    });

    this.client.on('error', (err) => {
      console.error('🔴 Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
    await this.publisher.quit();
    console.log('🔴 Redis disconnected');
  }

  getClient(): Redis {
    return this.client;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  getPublisher(): Redis {
    return this.publisher;
  }

  // Cache helpers
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.client.setex(key, ttl, serializedValue);
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Pub/Sub helpers
  async publish(channel: string, message: any): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        callback(JSON.parse(message));
      }
    });
  }
}
EOF

cat > src/redis/redis.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
EOF

# Create common DTOs and types
mkdir -p src/common/{dto,guards,interceptors,decorators}

cat > src/common/dto/pagination.dto.ts << 'EOF'
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
EOF

cat > src/common/dto/date-range.dto.ts << 'EOF'
import { IsOptional, IsDateString } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
EOF

# Create basic module structure for each feature
echo "📁 Creating feature modules..."

# Users module
mkdir -p src/modules/users
cat > src/modules/users/users.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
EOF

cat > src/modules/users/users.controller.ts << 'EOF'
import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get('stats')
  async getStats() {
    return this.usersService.getStats();
  }
}
EOF

cat > src/modules/users/users.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationDto;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const total = await this.prisma.user.count();
    const admins = await this.prisma.user.count({ where: { role: 'admin' } });
    const managers = await this.prisma.user.count({ where: { role: 'manager' } });
    const users = await this.prisma.user.count({ where: { role: 'user' } });

    return {
      total,
      admins,
      managers,
      users,
    };
  }
}
EOF

# Orders module
mkdir -p src/modules/orders
cat > src/modules/orders/orders.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
EOF

cat > src/modules/orders/orders.controller.ts << 'EOF'
import { Controller, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { DateRangeDto } from '@/common/dto/date-range.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @Get('stats')
  async getStats(@Query() dateRangeDto: DateRangeDto) {
    return this.ordersService.getStats(dateRangeDto);
  }

  @Get('today')
  async getTodayStats() {
    return this.ordersService.getTodayStats();
  }
}
EOF

cat > src/modules/orders/orders.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { DateRangeDto } from '@/common/dto/date-range.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationDto;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { name: true, category: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders,
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

    const [total, completed, pending, cancelled, totalAmount] = await Promise.all([
      this.prisma.order.count({ where: whereClause }),
      this.prisma.order.count({ where: { ...whereClause, status: 'completed' } }),
      this.prisma.order.count({ where: { ...whereClause, status: 'pending' } }),
      this.prisma.order.count({ where: { ...whereClause, status: 'cancelled' } }),
      this.prisma.order.aggregate({
        where: { ...whereClause, status: 'completed' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      cancelled,
      totalAmount: totalAmount._sum.totalAmount || 0,
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

# Create similar structure for other modules (Revenue, Payments, Transactions, Products, Reports)
# Revenue module
mkdir -p src/modules/revenue
cat > src/modules/revenue/revenue.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { RevenueController } from './revenue.controller';
import { RevenueService } from './revenue.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService],
})
export class RevenueModule {}
EOF

cat > src/modules/revenue/revenue.controller.ts << 'EOF'
import { Controller, Get, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  async getRevenue(@Query('year') year?: string) {
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    return this.revenueService.getRevenueByYear(yearNum);
  }

  @Get('monthly')
  async getMonthlyRevenue(@Query('year') year?: string) {
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    return this.revenueService.getMonthlyRevenue(yearNum);
  }
}
EOF

cat > src/modules/revenue/revenue.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class RevenueService {
  constructor(private prisma: PrismaService) {}

  async getRevenueByYear(year: number) {
    const revenue = await this.prisma.revenue.findMany({
      where: { year },
      orderBy: { month: 'asc' },
    });

    const total = revenue.reduce((sum, r) => sum + r.amount, 0);

    return {
      year,
      total,
      data: revenue,
    };
  }

  async getMonthlyRevenue(year: number) {
    return this.prisma.revenue.findMany({
      where: { year },
      orderBy: { month: 'asc' },
    });
  }
}
EOF

# Create basic structure for remaining modules
for module in payments transactions products reports; do
    mkdir -p "src/modules/$module"
    
    # Module file
    cat > "src/modules/$module/${module}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { ${module^}Controller } from './${module}.controller';
import { ${module^}Service } from './${module}.service';

@Module({
  imports: [DatabaseModule],
  controllers: [${module^}Controller],
  providers: [${module^}Service],
  exports: [${module^}Service],
})
export class ${module^}Module {}
EOF

    # Controller file
    cat > "src/modules/$module/${module}.controller.ts" << EOF
import { Controller, Get } from '@nestjs/common';
import { ${module^}Service } from './${module}.service';

@Controller('$module')
export class ${module^}Controller {
  constructor(private readonly ${module}Service: ${module^}Service) {}

  @Get()
  async findAll() {
    return this.${module}Service.findAll();
  }
}
EOF

    # Service file
    cat > "src/modules/$module/${module}.service.ts" << EOF
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ${module^}Service {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // TODO: Implement ${module} logic
    return { message: '${module^} service is working!' };
  }
}
EOF
done

# Create Prisma seed file
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@dashboard.com',
        role: 'admin',
        avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@dashboard.com',
        role: 'manager',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@dashboard.com',
        role: 'user',
        avatarUrl: 'https://ui-avatars.com/api/?name=Bob+Johnson',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'MacBook Pro',
        category: 'Electronics',
        price: 1999.99,
        stock: 50,
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPhone 15',
        category: 'Electronics',
        price: 999.99,
        stock: 100,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Coffee Mug',
        category: 'Office',
        price: 19.99,
        stock: 200,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create sample revenue data
  const currentYear = new Date().getFullYear();
  const revenueData = [];
  
  for (let month = 1; month <= 12; month++) {
    const amount = Math.floor(Math.random() * 50000) + 10000; // Random between 10k-60k
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

  // Create sample orders
  const orders = [];
  for (let i = 0; i < 20; i++) {
    orders.push({
      userId: users[Math.floor(Math.random() * users.length)].id,
      productId: products[Math.floor(Math.random() * products.length)].id,
      quantity: Math.floor(Math.random() * 5) + 1,
      totalAmount: Math.floor(Math.random() * 1000) + 50,
      status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
    });
  }

  await prisma.order.createMany({
    data: orders,
  });

  console.log(`✅ Created ${orders.length} orders`);

  console.log('🎉 Database seed completed successfully!');
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
echo "✅ Step 2: Backend Core Setup Complete!"
echo ""
echo "📦 What was created:"
echo "   ✅ NestJS application structure"
echo "   ✅ Database service (Prisma)"
echo "   ✅ Redis service with pub/sub"
echo "   ✅ All feature modules (users, orders, revenue, etc.)"
echo "   ✅ Common DTOs and utilities"
echo "   ✅ Database seed script"
echo ""
echo "🧪 Test your backend:"
echo "   1. Install dependencies: cd backend && npm install"
echo "   2. Generate Prisma client: npm run prisma:generate"
echo "   3. Start database: cd .. && docker-compose up -d postgres redis"
echo "   4. Push schema: cd backend && npm run prisma:push"
echo "   5. Seed database: npm run prisma:seed"
echo "   6. Start backend: npm run start:dev"
echo ""
echo "🌐 API endpoints will be available at:"
echo "   • http://localhost:4000/api"
echo "   • http://localhost:4000/api/health"
echo "   • http://localhost:4000/api/users"
echo "   • http://localhost:4000/api/orders"
echo "   • http://localhost:4000/api/revenue"
echo ""
echo "🚀 Ready for Step 3: API Development & Testing"