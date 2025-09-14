# StackGenie Frontend

A modern React-based frontend for the StackGenie visual application builder platform.

## 🚀 Features

### 🏗️ **Visual Builder**
- **Drag-and-Drop Interface**: Intuitive component placement with real-time preview
- **Component Library**: Extensive library of reusable UI components
- **Properties Panel**: Real-time component customization and styling
- **Live Preview**: See your changes instantly as you build

### 🤖 **AI-Powered Generation**
- **Smart Project Creation**: Generate complete applications from natural language descriptions
- **Code Conversion**: Convert HTML/CSS/JS to React components
- **File Processing**: Upload and convert existing code files

### 🗄️ **Database Schema Designer**
- **Visual Schema Builder**: Design database structures with drag-and-drop
- **Relationship Management**: Define complex relationships between tables
- **Prisma Export**: Generate Prisma schema files automatically
- **Field Configuration**: Set constraints, types, and relationships

### 🚀 **Deployment Center**
- **Multi-Platform Support**: Deploy to Vercel, Netlify, Render, Heroku
- **Database Integration**: Automatic database setup and configuration
- **Deployment Monitoring**: Real-time deployment status and logs
- **Environment Management**: Configure different deployment environments

### 📚 **Component Library**
- **Reusable Components**: Build and share custom components
- **Component Management**: Create, edit, and organize component libraries
- **Code Generation**: Automatic React component code generation
- **Version Control**: Track component versions and changes

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **@dnd-kit** - Drag and drop functionality
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notifications

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   ├── ComponentPalette.tsx  # Drag-and-drop component palette
│   ├── Canvas.tsx      # Builder canvas area
│   └── PropertiesPanel.tsx   # Component properties editor
├── pages/              # Application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── ProjectBuilder.tsx    # Visual builder interface
│   ├── AIGenerator.tsx       # AI-powered project generation
│   ├── SchemaDesigner.tsx    # Database schema designer
│   ├── ComponentLibrary.tsx  # Component management
│   └── DeploymentCenter.tsx  # Deployment management
├── services/           # API services
│   └── api.ts         # API client and types
└── styles/            # Global styles
    ├── index.css      # Tailwind imports and custom styles
    └── App.css        # Component-specific styles
```

## 🎨 Component Architecture

### **Builder Components**
- **ComponentPalette**: Drag-and-drop component library
- **Canvas**: Interactive building area with component placement
- **PropertiesPanel**: Real-time component customization

### **Data Models**
```typescript
interface Component {
  type: string
  props: {
    name?: string
    text?: string
    position: { x: number; y: number }
    style: Record<string, any>
  }
  code?: string
}

interface Project {
  projectId: string
  projectName: string
  description: string
  components: Component[]
  status: string
}
```

## 🔌 API Integration

The frontend integrates with the StackGenie backend API:

- **Project Management**: Create, read, update, delete projects
- **AI Generation**: Generate projects and convert code
- **Schema Management**: Design and manage database schemas
- **Component Library**: Manage reusable components
- **Deployment**: Handle project deployments

## 🎯 Key Features

### **Visual Builder**
- Drag components from palette to canvas
- Real-time property editing
- Live code generation
- Component positioning and styling

### **AI Integration**
- Natural language project generation
- Code conversion from various formats
- Smart component suggestions
- Automated project scaffolding

### **Schema Designer**
- Visual table creation and editing
- Field type management
- Relationship definition
- Prisma schema export

### **Deployment Management**
- Multi-platform deployment support
- Real-time deployment monitoring
- Environment configuration
- Database setup automation

## 🚀 Getting Started

1. **Start the Backend**: Ensure the StackGenie backend is running on `http://localhost:5000`

2. **Run the Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**: Open `http://localhost:5173` in your browser

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=StackGenie
```

### **API Configuration**
The API client is configured in `src/services/api.ts` and automatically handles:
- Authentication tokens
- Request/response interceptors
- Error handling
- Base URL configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Dark Mode Ready**: Prepared for dark theme implementation
- **Accessibility**: WCAG compliant components

## 🧪 Development

### **Code Quality**
- ESLint configuration for code quality
- TypeScript for type safety
- Prettier for code formatting

### **Testing**
- Component testing setup ready
- Integration test structure
- E2E testing preparation

## 📄 License

This project is part of the StackGenie platform and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**StackGenie Frontend** - Building the future of visual application development 🚀