import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectBuilder from './pages/ProjectBuilder'
import ProjectList from './pages/ProjectList'
import CreateProject from './pages/CreateProject'
import SchemaDesigner from './pages/SchemaDesigner'
import ComponentLibrary from './pages/ComponentLibrary'
import DeploymentCenter from './pages/DeploymentCenter'
import AIGenerator from './pages/AIGenerator'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/create" element={<CreateProject />} />
        <Route path="/projects/:projectId/builder" element={<ProjectBuilder />} />
        <Route path="/projects/:projectId/schema" element={<SchemaDesigner />} />
        <Route path="/projects/:projectId/deploy" element={<DeploymentCenter />} />
        <Route path="/components" element={<ComponentLibrary />} />
        <Route path="/ai-generator" element={<AIGenerator />} />
      </Routes>
    </Layout>
  )
}

export default App