import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Rocket, 
  Play, 
  Pause, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Database,
  Globe,
  Server,
  Monitor,
  ArrowLeft,
  Plus,
  Download,
  Eye
} from 'lucide-react'
import { deploymentAPI, projectAPI, type Deployment, type Project } from '../services/api'
import toast from 'react-hot-toast'

const platforms = {
  frontend: [
    { id: 'vercel', name: 'Vercel', icon: Globe, description: 'Modern frontend deployment' },
    { id: 'netlify', name: 'Netlify', icon: Globe, description: 'JAMstack deployment' },
    { id: 'github-pages', name: 'GitHub Pages', icon: Globe, description: 'Free static hosting' }
  ],
  backend: [
    { id: 'render', name: 'Render', icon: Server, description: 'Full-stack deployment' },
    { id: 'heroku', name: 'Heroku', icon: Server, description: 'Cloud platform' },
    { id: 'railway', name: 'Railway', icon: Server, description: 'Modern deployment' }
  ],
  database: [
    { id: 'mongodb', name: 'MongoDB Atlas', icon: Database, description: 'Cloud database' },
    { id: 'postgresql', name: 'PostgreSQL', icon: Database, description: 'Relational database' },
    { id: 'mysql', name: 'MySQL', icon: Database, description: 'Popular database' }
  ]
}

export default function DeploymentCenter() {
  const { projectId } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [showDeployModal, setShowDeployModal] = useState(false)
  const [deploymentConfig, setDeploymentConfig] = useState({
    frontend: { platform: 'vercel', domain: '' },
    backend: { platform: 'render', database: 'mongodb' }
  })

  useEffect(() => {
    if (projectId) {
      loadProjectData()
    }
  }, [projectId])

  const loadProjectData = async () => {
    try {
      const [projectRes, deploymentsRes] = await Promise.all([
        projectAPI.getById(projectId!),
        deploymentAPI.getProjectDeployments(projectId!)
      ])
      setProject(projectRes.data)
      setDeployments(deploymentsRes.data)
    } catch (error) {
      console.error('Failed to load project data:', error)
      toast.error('Failed to load project data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      const response = await deploymentAPI.create({
        projectId: projectId!,
        frontend: deploymentConfig.frontend,
        backend: deploymentConfig.backend
      })
      setDeployments([response.data, ...deployments])
      setShowDeployModal(false)
      toast.success('Deployment started successfully!')
    } catch (error) {
      console.error('Failed to start deployment:', error)
      toast.error('Failed to start deployment')
    } finally {
      setDeploying(false)
    }
  }

  const handleCancelDeployment = async (deploymentId: string) => {
    try {
      await deploymentAPI.cancel(deploymentId)
      setDeployments(deployments.map(d => 
        d._id === deploymentId 
          ? { ...d, status: 'failed' }
          : d
      ))
      toast.success('Deployment cancelled')
    } catch (error) {
      console.error('Failed to cancel deployment:', error)
      toast.error('Failed to cancel deployment')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'in-progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
        <Link to="/projects" className="text-blue-600 hover:text-blue-800">
          Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={`/projects/${projectId}/builder`}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deployment Center</h1>
            <p className="mt-2 text-gray-600">
              Deploy and manage {project.projectName}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeployModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Deploy Project
        </button>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Project Overview</h2>
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
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Monitor className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Components</p>
              <p className="text-2xl font-bold text-blue-600">{project.components.length}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Database Schema</p>
              <p className="text-2xl font-bold text-green-600">
                {project.schema ? 'Ready' : 'Not Set'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Rocket className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Deployments</p>
              <p className="text-2xl font-bold text-purple-600">{deployments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Deployment History</h2>
        </div>
        <div className="p-6">
          {deployments.length === 0 ? (
            <div className="text-center py-8">
              <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deployments yet</h3>
              <p className="text-gray-500 mb-4">Deploy your project to see deployment history</p>
              <button
                onClick={() => setShowDeployModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Deploy Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div key={deployment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(deployment.status)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Deployment #{deployment._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {deployment.frontend.platform} • {deployment.backend.platform}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(deployment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </span>
                      {deployment.frontend.url && (
                        <a
                          href={deployment.frontend.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Site
                        </a>
                      )}
                      {deployment.status === 'in-progress' && (
                        <button
                          onClick={() => handleCancelDeployment(deployment._id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Deployment Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Globe className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Frontend</span>
                      </div>
                      <p className="text-sm text-gray-600">{deployment.frontend.platform}</p>
                      <p className="text-xs text-gray-500">
                        Status: {deployment.frontend.status}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Server className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Backend</span>
                      </div>
                      <p className="text-sm text-gray-600">{deployment.backend.platform}</p>
                      <p className="text-xs text-gray-500">
                        Database: {deployment.backend.database}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deploy Project</h3>
            
            <div className="space-y-6">
              {/* Frontend Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Frontend Platform
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {platforms.frontend.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setDeploymentConfig({
                        ...deploymentConfig,
                        frontend: { ...deploymentConfig.frontend, platform: platform.id }
                      })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        deploymentConfig.frontend.platform === platform.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <platform.icon className="h-5 w-5 text-gray-600 mb-2" />
                      <p className="font-medium text-gray-900">{platform.name}</p>
                      <p className="text-xs text-gray-500">{platform.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Backend Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Backend Platform
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {platforms.backend.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setDeploymentConfig({
                        ...deploymentConfig,
                        backend: { ...deploymentConfig.backend, platform: platform.id }
                      })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        deploymentConfig.backend.platform === platform.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <platform.icon className="h-5 w-5 text-gray-600 mb-2" />
                      <p className="font-medium text-gray-900">{platform.name}</p>
                      <p className="text-xs text-gray-500">{platform.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Database */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Database
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {platforms.database.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setDeploymentConfig({
                        ...deploymentConfig,
                        backend: { ...deploymentConfig.backend, database: platform.id }
                      })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        deploymentConfig.backend.database === platform.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <platform.icon className="h-5 w-5 text-gray-600 mb-2" />
                      <p className="font-medium text-gray-900">{platform.name}</p>
                      <p className="text-xs text-gray-500">{platform.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {deploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
