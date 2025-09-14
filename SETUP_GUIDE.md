# StackGenie Setup Guide

## ✅ Issues Fixed

### 1. **Frontend-Backend Connection**
- ✅ Fixed API base URL: `http://localhost:5000/api` (was pointing to 3001)
- ✅ Updated all API routes to match backend structure
- ✅ Added missing API endpoints (auth, webhook, custom)

### 2. **Backend Configuration**
- ✅ Fixed MongoDB connection (removed deprecated options)
- ✅ Created environment configuration template
- ✅ Verified all route structures

### 3. **API Route Mapping**
- ✅ **Projects**: `/api/projects/*` → Working correctly
- ✅ **Schema**: `/api/projects/:projectId/schema/*` → Fixed routes
- ✅ **Components**: `/api/crud/components/*` → Fixed routes  
- ✅ **AI**: `/api/crud/convert/*` → Fixed routes
- ✅ **Deployments**: `/api/deployments/*` → Working correctly
- ✅ **Auth**: `/api/auth/*` → Added missing endpoints
- ✅ **Webhooks**: `/api/webhooks/*` → Added missing endpoints
- ✅ **Custom**: `/api/custom/*` → Added missing endpoints

## 🚀 Setup Instructions

### Backend Setup
1. **Install dependencies:**
   ```bash
   cd Backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env
   ```
   
3. **Configure `.env` file:**
   ```env
   MONGO_URI=mongodb://localhost:27017/stackgenie
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if not running):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   ```

5. **Start backend:**
   ```bash
   npm start
   ```

### Frontend Setup
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

## 🔗 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:projectId` - Get project by ID
- `PUT /api/projects/:projectId/save` - Save project components
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/generate` - Generate project with AI

### Schema Management
- `GET /api/projects/:projectId/schema` - Get schema
- `PUT /api/projects/:projectId/schema` - Update schema
- `POST /api/projects/:projectId/schema/tables` - Add table
- `PUT /api/projects/:projectId/schema/tables` - Update table
- `DELETE /api/projects/:projectId/schema/tables` - Delete table
- `POST /api/projects/:projectId/schema/relationships` - Add relationship
- `DELETE /api/projects/:projectId/schema/relationships` - Delete relationship
- `GET /api/projects/:projectId/schema/generate` - Generate Prisma schema

### Components
- `POST /api/crud/components` - Create component
- `GET /api/crud/components` - Get all components
- `GET /api/crud/components/:id` - Get component by ID
- `PUT /api/crud/components/:id` - Update component
- `DELETE /api/crud/components/:id` - Delete component

### AI Services
- `POST /api/crud/convert/code` - Convert code
- `POST /api/crud/convert/file` - Process file

### Deployments
- `POST /api/deployments` - Create deployment
- `GET /api/deployments/:deploymentId/status` - Get deployment status
- `GET /api/deployments/project/:projectId` - Get project deployments
- `POST /api/deployments/:deploymentId/cancel` - Cancel deployment
- `GET /api/deployments/:deploymentId/logs` - Get deployment logs

### Webhooks
- `POST /api/webhooks/register` - Register webhook
- `GET /api/webhooks/list` - List webhooks
- `PUT /api/webhooks/:id` - Update webhook
- `DELETE /api/webhooks/:id` - Delete webhook
- `POST /api/webhooks/test/:id` - Test webhook

### Custom Services
- `POST /api/custom/generate-structure` - Generate project structure
- `POST /api/custom/analyze` - Analyze code
- `POST /api/custom/deploy` - Deploy project
- `POST /api/custom/validate-schema` - Validate schema
- `POST /api/custom/generate-docs` - Generate documentation

## ✅ All Routes Connected Correctly!

Your frontend and backend are now properly connected with all routes mapped correctly. No dummy data is being used - all API calls point to real backend endpoints with proper CRUD operations.
