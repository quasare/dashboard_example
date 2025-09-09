# Real Estate Dashboard

A modern Next.js dashboard application with comprehensive property management features.

## Features

- 🏠 **Dashboard Overview**: KPIs, revenue charts, and real-time data
- 👥 **User Management**: Admin controls with role-based permissions
- 📊 **Orders & Payments**: Complete transaction management
- 📦 **Product Catalog**: Inventory and product management
- 📈 **Revenue Analytics**: Financial insights and reporting
- ⚙️ **Settings & Profile**: User profile management with billing integration

## Admin Features

- **Profile Management**: Complete user profile editing with avatar upload
- **Billing Integration**: Subscription management and payment history
- **Settings**: Application and user preferences
- **Working Admin Dropdown**: All navigation links functional

## Deployment on Render

### Option 1: Docker Deployment (Recommended)
1. **Runtime**: Docker
2. **Dockerfile Path**: `Dockerfile.render`
3. **Docker Build Context**: `.`
4. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=10000`

### Option 2: Node.js Deployment
1. **Runtime**: Node.js
2. **Build Command**: `npm ci && npm run build`
3. **Start Command**: `cd .next/standalone && node server.js`
4. **Node Version**: `18`
5. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=10000`

### Option 3: Using render.yaml
Connect your repository and Render will auto-configure using the included `render.yaml` file.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
cd .next/standalone && node server.js
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-based modules
│   ├── lib/             # Utilities and configurations
│   └── styles/          # Global styles
├── public/              # Static assets
├── Dockerfile.render    # Production Docker configuration
├── render.yaml         # Render deployment configuration
└── render-deploy.sh    # Alternative deployment script
```

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Chart.js & Recharts
- **TypeScript**: Full type safety

## Production Ready

✅ All TypeScript errors resolved  
✅ Production build optimized  
✅ Standalone output for deployment  
✅ Docker configuration included  
✅ Environment variables configured  
✅ Health checks configured  

---

Generated with [Claude Code](https://claude.ai/code)