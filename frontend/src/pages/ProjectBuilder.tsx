import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Save, 
  Eye, 
  Code, 
  Layers, 
  ArrowLeft,
  Zap
} from 'lucide-react'
import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { projectAPI, type Project, type Component } from '../services/api'
import ComponentPalette from '../components/ComponentPalette'
import Canvas from '../components/Canvas'
import PropertiesPanel from '../components/PropertiesPanel'
import ConnectionPanel from '../components/ConnectionPanel'
import toast from 'react-hot-toast'

interface Connection {
  id: string
  from: string
  to: string
  type: 'data' | 'action' | 'parent-child'
  label?: string
}

export default function ProjectBuilder() {
  const { projectId } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [components, setComponents] = useState<Component[]>([])
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'canvas' | 'code' | 'preview' | 'connections'>('canvas')
  const [connections, setConnections] = useState<Connection[]>([])

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const loadProject = async () => {
    try {
      const response = await projectAPI.getById(projectId!)
      setProject(response.data)
      const projectComponents = response.data.components || []
      
      // Add unique IDs to components if they don't have them
      const componentsWithIds = projectComponents.map((comp: Component, index: number) => ({
        ...comp,
        id: comp.id || `comp-${index}-${Date.now()}`
      }))
      
      setComponents(componentsWithIds)
      
      // Load connections from project data (if stored)
      if (response.data.connections) {
        setConnections(response.data.connections)
      }
    } catch (error) {
      console.error('Failed to load project:', error)
      toast.error('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await projectAPI.save(projectId!, components)
      setProject(response.data)
      toast.success('Project saved successfully!')
    } catch (error) {
      console.error('Failed to save project:', error)
      toast.error('Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  // Connection management functions
  const handleAddConnection = (connection: Omit<Connection, 'id'>) => {
    const newConnection: Connection = {
      ...connection,
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setConnections(prev => [...prev, newConnection])
    toast.success('Connection added successfully!')
  }

  const handleRemoveConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
    toast.success('Connection removed successfully!')
  }

  const handleDragStart = (_event: DragStartEvent) => {
    // Handle drag start if needed
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.data.current) {
      const componentType = active.data.current.type
      const newComponent: Component = {
        id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: componentType,
        props: {
          name: `${componentType}_${Date.now()}`,
          text: getDefaultText(componentType),
          position: { x: 100, y: 100 },
          style: getDefaultStyle(componentType)
        }
      }

      setComponents([...components, newComponent])
      toast.success(`${componentType} component added!`)
    }
  }

  const getDefaultText = (type: string): string => {
    switch (type) {
      case 'Button': return 'Click me'
      case 'Card': return 'Card content'
      case 'Text': return 'Sample text'
      case 'Input': return 'Enter text...'
      default: return ''
    }
  }

  const getDefaultStyle = (type: string): Record<string, any> => {
    switch (type) {
      case 'Button':
        return {
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        }
      case 'Card':
        return {
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }
      case 'Text':
        return {
          color: '#374151',
          fontSize: '16px',
          fontFamily: 'inherit'
        }
      case 'Input':
        return {
          border: '1px solid #D1D5DB',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '14px'
        }
      default:
        return {}
    }
  }

  const updateComponent = (index: number, updates: Partial<Component>) => {
    const updatedComponents = [...components]
    updatedComponents[index] = { ...updatedComponents[index], ...updates }
    setComponents(updatedComponents)
  }

  const deleteComponent = (index: number) => {
    const updatedComponents = components.filter((_, i) => i !== index)
    setComponents(updatedComponents)
    setSelectedComponent(null)
    toast.success('Component deleted!')
  }

  const generateCode = () => {
    const reactCode = components.map((component, index) => {
      const { type, props } = component
      const { text, style } = props
      
      switch (type) {
        case 'Button':
          return `<button key="${index}" style={${JSON.stringify(style)}}>${text}</button>`
        case 'Card':
          return `<div key="${index}" style={${JSON.stringify(style)}}>${text}</div>`
        case 'Text':
          return `<p key="${index}" style={${JSON.stringify(style)}}>${text}</p>`
        case 'Input':
          return `<input key="${index}" style={${JSON.stringify(style)}} placeholder="${text}" />`
        default:
          return `<!-- ${type} component -->`
      }
    }).join('\n')

    return `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div>
      ${reactCode}
    </div>
  );
};

export default GeneratedComponent;`
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/projects"
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{project.projectName}</h1>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'canvas', name: 'Canvas', icon: Layers },
                { id: 'connections', name: 'Connections', icon: Zap },
                { id: 'code', name: 'Code', icon: Code },
                { id: 'preview', name: 'Preview', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2 inline" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {activeTab === 'canvas' && (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Components</h3>
                  <p className="text-sm text-gray-500">Drag components to the canvas</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ComponentPalette />
                </div>
              </>
            )}
            
            {activeTab === 'canvas' && selectedComponent && (
              <div className="border-t border-gray-200">
                <PropertiesPanel
                  component={selectedComponent}
                  onUpdate={(updates) => {
                    const index = components.findIndex(c => c === selectedComponent)
                    if (index !== -1) {
                      updateComponent(index, updates)
                      setSelectedComponent({ ...selectedComponent, ...updates })
                    }
                  }}
                  onDelete={() => {
                    const index = components.findIndex(c => c === selectedComponent)
                    if (index !== -1) {
                      deleteComponent(index)
                    }
                  }}
                />
              </div>
            )}

            {activeTab === 'canvas' && selectedComponent && (
              <ConnectionPanel
                selectedComponent={selectedComponent}
                components={components}
                connections={connections}
                onAddConnection={handleAddConnection}
                onRemoveConnection={handleRemoveConnection}
              />
            )}
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'canvas' && (
              <Canvas
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                onUpdateComponent={(index, updates) => updateComponent(index, updates)}
                connections={connections}
                onAddConnection={handleAddConnection}
                onRemoveConnection={handleRemoveConnection}
              />
            )}

            {activeTab === 'connections' && (
              <div className="flex-1 flex">
                <div className="flex-1 bg-gray-50 p-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Connection Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Zap className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Data Flow</p>
                            <p className="text-2xl font-bold text-green-600">
                              {connections.filter(c => c.type === 'data').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Zap className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Actions</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {connections.filter(c => c.type === 'action').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Zap className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Hierarchy</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {connections.filter(c => c.type === 'parent-child').length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {connections.length === 0 ? (
                      <div className="text-center py-12">
                        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Connections Yet</h4>
                        <p className="text-gray-500 mb-4">
                          Create connections between components to build interactive flows
                        </p>
                        <button
                          onClick={() => setActiveTab('canvas')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Layers className="h-4 w-4 mr-2" />
                          Go to Canvas
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">All Connections</h4>
                        {connections.map((connection) => {
                          const fromComponent = components.find(c => c.id === connection.from)
                          const toComponent = components.find(c => c.id === connection.to)
                          
                          return (
                            <div key={connection.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${
                                    connection.type === 'data' ? 'bg-green-100 text-green-600' :
                                    connection.type === 'action' ? 'bg-blue-100 text-blue-600' :
                                    'bg-purple-100 text-purple-600'
                                  }`}>
                                    <Zap className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {fromComponent?.type} → {toComponent?.type}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {connection.type.replace('-', ' ').toUpperCase()}
                                      {connection.label && ` • ${connection.label}`}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveConnection(connection.id)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                >
                                  <Zap className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'code' && (
              <div className="flex-1 bg-gray-900 text-white p-6 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Generated Code</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateCode())}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="text-sm">
                  <code>{generateCode()}</code>
                </pre>
              </div>
            )}
            
            {activeTab === 'preview' && (
              <div className="flex-1 bg-white p-6 overflow-auto">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4 min-h-96">
                  {components.map((component, index) => {
                    const { type, props } = component
                    const { text, style } = props
                    
                    switch (type) {
                      case 'Button':
                        return (
                          <button
                            key={index}
                            style={style}
                            className="mr-2 mb-2"
                          >
                            {text}
                          </button>
                        )
                      case 'Card':
                        return (
                          <div
                            key={index}
                            style={style}
                            className="mr-2 mb-2"
                          >
                            {text}
                          </div>
                        )
                      case 'Text':
                        return (
                          <p
                            key={index}
                            style={style}
                            className="mr-2 mb-2"
                          >
                            {text}
                          </p>
                        )
                      case 'Input':
                        return (
                          <input
                            key={index}
                            style={style}
                            placeholder={text}
                            className="mr-2 mb-2"
                          />
                        )
                      default:
                        return null
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
