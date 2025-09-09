#!/bin/bash

# Step 1: Dashboard Project Setup
# This script creates the complete project structure and configuration files

set -e  # Exit on any error

echo "🚀 Initializing Dashboard Project..."

# Create main project directory
PROJECT_NAME="dashboard-project"
echo "📁 Creating project directory: $PROJECT_NAME"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Create backend directory structure
echo "📂 Creating backend structure..."
mkdir -p backend/src/{modules,common,config,database,redis}
mkdir -p backend/src/modules/{users,orders,revenue,payments,transactions,products,reports}
mkdir -p backend/prisma
mkdir -p backend/test

# Create each backend module's subdirectories
for module in users orders revenue payments transactions products reports; do
  mkdir -p backend/src/modules/$module
done

# Create frontend directory structure  
echo "📂 Creating frontend structure..."
mkdir -p frontend/src/{app,features,components,lib,hooks,types,styles}
mkdir -p frontend/src/features/{layout,notifications,kpis,revenue,orders,finance,transactions,shared}

# Create each frontend feature's subdirectories
for feature in layout notifications kpis revenue orders finance transactions shared; do
  mkdir -p frontend/src/features/$feature/{components,hooks,types,lib}
done

# Create root configuration files
echo "⚙️  Creating configuration files..."

# Create .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://dashboard_user:dashboard_pass@localhost:5432/dashboard_db"
POSTGRES_DB=dashboard_db
POSTGRES_USER=dashboard_user
POSTGRES_PASSWORD=dashboard_pass

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# API
NODE_ENV=development
BACKEND_PORT=4000
FRONTEND_PORT=3000

# Frontend API URLs
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Database
*.db
*.sqlite

# Docker
.docker/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Prisma
migrations/
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: dashboard_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: dashboard_db
      POSTGRES_USER: dashboard_user
      POSTGRES_PASSWORD: dashboard_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - dashboard_network

  # Redis Cache & Pub/Sub
  redis:
    image: redis:7-alpine
    container_name: dashboard_redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - dashboard_network

  # Backend API (NestJS)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dashboard_backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://dashboard_user:dashboard_pass@postgres:5432/dashboard_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 4000
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - dashboard_network
    command: npm run start:dev

  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: dashboard_frontend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_API_URL: http://localhost:4000
      NEXT_PUBLIC_WS_URL: ws://localhost:4000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - dashboard_network
    command: npm run dev

volumes:
  postgres_data:
  redis_data:

networks:
  dashboard_network:
    driver: bridge
EOF

# Create backend package.json
cat > backend/package.json << 'EOF'
{
  "name": "dashboard-backend",
  "version": "1.0.0",
  "description": "NestJS Dashboard Backend API",
  "main": "dist/main.js",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "ioredis": "^5.3.0",
    "socket.io": "^4.7.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.8",
    "@types/passport-local": "^1.0.35",
    "@types/bcryptjs": "^2.4.2",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^5.59.11",
    "@typescript-eslint/parser": "^5.59.11",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "jest": "^29.5.0",
    "prettier": "^2.8.8",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.1",
    "typescript": "^5.1.3"
  }
}
EOF

# Create backend Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npm run prisma:generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:prod"]
EOF

# Create Prisma schema
cat > backend/prisma/schema.prisma << 'EOF'
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  role      String   // admin, manager, user
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  orders        Order[]
  transactions  Transaction[]
  payments      Payment[]

  @@map("users")
}

model Product {
  id       Int     @id @default(autoincrement())
  name     String
  category String
  price    Float
  stock    Int
  imageUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  orders Order[]

  @@map("products")
}

model Order {
  id          Int      @id @default(autoincrement())
  userId      Int
  productId   Int
  quantity    Int
  totalAmount Float
  status      String   // pending, completed, cancelled
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("orders")
}

model Revenue {
  id     Int      @id @default(autoincrement())
  date   DateTime
  year   Int
  month  Int
  amount Float

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([year, month])
  @@map("revenues")
}

model Payment {
  id        Int      @id @default(autoincrement())
  userId    Int
  method    String   // credit_card, paypal, stripe, etc
  amount    Float
  status    String   // pending, completed, failed
  reference String?  // external payment reference
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@map("payments")
}

model Transaction {
  id       Int      @id @default(autoincrement())
  type     String   // income, expense, transfer
  method   String   // paypal, wallet, transfer, etc
  amount   Float
  currency String   @default("USD")
  userId   Int
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@map("transactions")
}

model ProfileReport {
  id               Int   @id @default(autoincrement())
  year             Int   @unique
  growthPercentage Float
  totalRevenue     Float

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("profile_reports")
}
EOF

# Create frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "dashboard-frontend",
  "version": "1.0.0",
  "description": "Next.js Dashboard Frontend",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "swr": "^2.2.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.7.0",
    "recharts": "^2.8.0",
    "lucide-react": "^0.292.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-progress": "^1.0.3"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@tailwindcss/forms": "^0.5.0"
  }
}
EOF

# Create frontend Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
EOF

# Copy .env.example to .env
cp .env.example .env

# Create README.md
cat > README.md << 'EOF'
# Dashboard Project - Step 1 Complete ✅

## What's Created

✅ **Project Structure**: Complete backend & frontend directories
✅ **Docker Setup**: docker-compose.yml with PostgreSQL, Redis, Backend, Frontend
✅ **Backend Config**: NestJS package.json, Dockerfile, Prisma schema
✅ **Frontend Config**: Next.js package.json, Dockerfile
✅ **Environment**: .env.example with all required variables

## Next Steps

### Verify Setup
```bash
# Check structure
tree -L 3

# Test Docker services (PostgreSQL & Redis only)
docker-compose up -d postgres redis

# Check if running
docker-compose ps
```

### Ready for Step 2: Backend Core
- NestJS main application setup
- Database connection & Prisma service  
- Redis service setup
- Basic module structure
- Authentication setup

## Project Structure
```
dashboard-project/
├── docker-compose.yml
├── .env
├── backend/
│   ├── src/modules/
│   ├── prisma/schema.prisma
│   ├── package.json
│   └── Dockerfile
└── frontend/
    ├── src/features/
    ├── package.json
    └── Dockerfile
```

## Services
- **PostgreSQL**: localhost:5432 
- **Redis**: localhost:6379
- **Backend**: localhost:4000 (when ready)
- **Frontend**: localhost:3000 (when ready)
EOF

echo ""
echo "✅ Step 1: Project Setup Complete!"
echo ""
echo "📁 Project structure created in: ./$PROJECT_NAME"
echo "⚙️  Configuration files ready"
echo "🐳 Docker setup configured"
echo ""
echo "🧪 Test your setup:"
echo "cd $PROJECT_NAME"
echo "docker-compose up -d postgres redis"
echo "docker-compose ps"
echo ""
echo "🚀 Ready for Step 2: Backend Core Development"