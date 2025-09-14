import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Copy, 
  Eye,
  Edit,
  Trash2,
  Star,
  Tag,
  Code,
  Palette
} from 'lucide-react'
import { componentAPI } from '../services/api'
import toast from 'react-hot-toast'

interface Component {
  _id: string
  name: string
  type: string
  description: string
  configuration: any
  status: string
  version: string
  createdBy: string
  projectId: string
  createdAt: string
}

const categories = [
  'All',
  'Basic',
  'Forms',
  'Layout',
  'Navigation',
  'Media',
  'Interactive',
  'Feedback',
  'Data'
]

const componentTypes = [
  'Button',
  'Input',
  'Card',
  'Modal',
  'Table',
  'Chart',
  'Navbar',
  'Sidebar',
  'Form',
  'Alert'
]

export default function ComponentLibrary() {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: '',
    description: '',
    configuration: {}
  })

  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    try {
      const response = await componentAPI.getAll()
      
      // Handle response format from responseHandler
      if (response.data.success) {
        setComponents(response.data.data || [])
      } else {
        setComponents([])
      }
    } catch (error) {
      console.error('Failed to load components:', error)
      toast.error('Failed to load components')
      setComponents([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComponent = async () => {
    if (!newComponent.name || !newComponent.type || !newComponent.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await componentAPI.create({
        ...newComponent,
        projectId: 'library' // For library components
      })
      
      if (response.data.success) {
        toast.success('Component created successfully!')
        setShowCreateModal(false)
        setNewComponent({ name: '', type: '', description: '', configuration: {} })
        loadComponents()
      } else {
        toast.error('Failed to create component')
      }
    } catch (error) {
      console.error('Failed to create component:', error)
      toast.error('Failed to create component')
    }
  }

  const handleDeleteComponent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return

    try {
      const response = await componentAPI.delete(id)
      
      if (response.data.success) {
        setComponents(components.filter(c => c._id !== id))
        toast.success('Component deleted successfully!')
      } else {
        toast.error('Failed to delete component')
      }
    } catch (error) {
      console.error('Failed to delete component:', error)
      toast.error('Failed to delete component')
    }
  }

  const copyComponentCode = (component: Component) => {
    const code = `// ${component.name} Component
import React from 'react';

const ${component.name} = ({ ...props }) => {
  return (
    <div className="${component.type.toLowerCase()}">
      {/* ${component.description} */}
      {props.children}
    </div>
  );
};

export default ${component.name};`
    
    navigator.clipboard.writeText(code)
    toast.success('Component code copied to clipboard!')
  }

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || component.type === selectedCategory
    const matchesType = !selectedType || component.type === selectedType
    return matchesSearch && matchesCategory && matchesType
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
          <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
          <p className="mt-2 text-gray-600">
            Browse and manage reusable components for your projects
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Component
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Components */}
      {filteredComponents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'All' ? 'No components found' : 'No components yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start building your component library by creating your first component'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Component
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredComponents.map((component) => (
            viewMode === 'grid' ? (
              <div key={component._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Code className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {component.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyComponentCode(component)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy Code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(component._id)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {component.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>v{component.version}</span>
                    <span>{new Date(component.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={component._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                      <p className="text-gray-600">{component.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {component.type}
                        </span>
                        <span className="text-xs text-gray-500">v{component.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyComponentCode(component)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Code
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(component._id)}
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Create Component Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Component</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., CustomButton, DataTable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Type
                </label>
                <select
                  value={newComponent.type}
                  onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  {componentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newComponent.description}
                  onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what this component does..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateComponent}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Component
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
