import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  FolderOpen, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { projectAPI, type Project } from '../services/api'
import toast from 'react-hot-toast'

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll()
      setProjects(response.data)
    } catch (error) {
      console.error('Failed to load projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await projectAPI.delete(projectId)
      setProjects(projects.filter(p => p.projectId !== projectId))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize your StackGenie projects
          </p>
        </div>
        <Link
          to="/projects/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="saved">Saved</option>
              <option value="generated">Generated</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first project'
            }
          </p>
          <Link
            to="/projects/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FolderOpen className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.projectName}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : project.status === 'generated'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        <Link
                          to={`/projects/${project.projectId}/builder`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                        <Link
                          to={`/projects/${project.projectId}/schema`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Schema
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.projectId)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{project.components.length} components</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/projects/${project.projectId}/builder`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Open Builder
                  </Link>
                  <Link
                    to={`/projects/${project.projectId}/deploy`}
                    className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Deploy
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
