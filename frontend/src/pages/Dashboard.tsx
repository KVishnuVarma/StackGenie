import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  FolderOpen, 
  Sparkles, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { projectAPI, deploymentAPI, type Project, type Deployment } from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [projectsRes, deploymentsRes] = await Promise.all([
        projectAPI.getAll(),
        deploymentAPI.getProjectDeployments('recent') // This would need backend support
      ])
      
      setProjects(projectsRes.data.slice(0, 5)) // Show latest 5 projects
      setDeployments(deploymentsRes.data.slice(0, 3)) // Show latest 3 deployments
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to StackGenie</h1>
        <p className="mt-2 text-gray-600">
          Build, design, and deploy full-stack applications with ease using our visual builder and AI-powered tools.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/projects/create"
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center">
            <Plus className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Create Project</h3>
              <p className="text-blue-100">Start a new project from scratch</p>
            </div>
          </div>
        </Link>

        <Link
          to="/ai-generator"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">AI Generator</h3>
              <p className="text-purple-100">Generate projects with AI</p>
            </div>
          </div>
        </Link>

        <Link
          to="/components"
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Component Library</h3>
              <p className="text-green-100">Browse reusable components</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first project</p>
              <Link
                to="/projects/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FolderOpen className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {project.projectName}
                      </h3>
                      <p className="text-gray-500">{project.description}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                    <Link
                      to={`/projects/${project.projectId}/builder`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Deployments</h2>
            <Link
              to="/deployments"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {deployments.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deployments yet</h3>
              <p className="text-gray-500">Deploy your projects to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div
                  key={deployment._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    {getStatusIcon(deployment.status)}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Deployment #{deployment._id.slice(-8)}
                      </h3>
                      <p className="text-gray-500">
                        {deployment.frontend.platform} • {deployment.backend.platform}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(deployment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      deployment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : deployment.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : deployment.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deployment.status}
                    </span>
                    {deployment.frontend.url && (
                      <a
                        href={deployment.frontend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
