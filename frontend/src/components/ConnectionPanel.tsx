import { useState, useRef, useEffect } from 'react'
import { Link, Plus, Minus, Zap, ArrowRight, Target } from 'lucide-react'

interface Connection {
  id: string
  from: string
  to: string
  type: 'data' | 'action' | 'parent-child'
  label?: string
}

interface ConnectionPoint {
  id: string
  componentId: string
  type: 'input' | 'output' | 'action'
  position: { x: number; y: number }
  label: string
}

interface ConnectionPanelProps {
  selectedComponent: any
  components: any[]
  connections: Connection[]
  onAddConnection: (connection: Omit<Connection, 'id'>) => void
  onRemoveConnection: (connectionId: string) => void
}

export default function ConnectionPanel({ 
  selectedComponent, 
  components, 
  connections, 
  onAddConnection, 
  onRemoveConnection 
}: ConnectionPanelProps) {
  const [showAddConnection, setShowAddConnection] = useState(false)
  const [connectionType, setConnectionType] = useState<'data' | 'action' | 'parent-child'>('data')
  const [targetComponent, setTargetComponent] = useState('')
  const [connectionLabel, setConnectionLabel] = useState('')

  const componentConnections = connections.filter(
    conn => conn.from === selectedComponent?.id || conn.to === selectedComponent?.id
  )

  const handleAddConnection = () => {
    if (!targetComponent) return

    onAddConnection({
      from: selectedComponent.id,
      to: targetComponent,
      type: connectionType,
      label: connectionLabel || undefined
    })

    setShowAddConnection(false)
    setTargetComponent('')
    setConnectionLabel('')
  }

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
          <p className="text-sm">Select a component to manage its connections</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Connections</h3>
          <button
            onClick={() => setShowAddConnection(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Connection
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Selected Component</h4>
          <p className="text-sm text-gray-600">{selectedComponent.type}</p>
        </div>
      </div>

      {/* Add Connection Form */}
      {showAddConnection && (
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Connection</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Connection Type
              </label>
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="data">Data Flow</option>
                <option value="action">Action Trigger</option>
                <option value="parent-child">Parent-Child</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Target Component
              </label>
              <select
                value={targetComponent}
                onChange={(e) => setTargetComponent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select component</option>
                {components
                  .filter(comp => comp.id !== selectedComponent.id)
                  .map(comp => (
                    <option key={comp.id} value={comp.id}>
                      {comp.type}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Label (Optional)
              </label>
              <input
                type="text"
                value={connectionLabel}
                onChange={(e) => setConnectionLabel(e.target.value)}
                placeholder="e.g., onClick, onSubmit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddConnection}
                disabled={!targetComponent}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Connection
              </button>
              <button
                onClick={() => setShowAddConnection(false)}
                className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Connections ({componentConnections.length})
        </h4>

        {componentConnections.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Zap className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No connections yet</p>
            <p className="text-xs text-gray-400">Add connections to create interactive flows</p>
          </div>
        ) : (
          <div className="space-y-3">
            {componentConnections.map((connection) => {
              const targetComp = components.find(c => c.id === connection.to)
              const sourceComp = components.find(c => c.id === connection.from)
              const isOutgoing = connection.from === selectedComponent.id

              return (
                <div
                  key={connection.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${
                        connection.type === 'data' ? 'bg-green-100 text-green-600' :
                        connection.type === 'action' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {connection.type === 'data' ? (
                          <ArrowRight className="h-3 w-3" />
                        ) : connection.type === 'action' ? (
                          <Zap className="h-3 w-3" />
                        ) : (
                          <Target className="h-3 w-3" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {connection.type.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveConnection(connection.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    {isOutgoing ? (
                      <>
                        <span className="font-medium">{selectedComponent.type}</span>
                        <span className="mx-1">→</span>
                        <span className="font-medium">{targetComp?.type}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{sourceComp?.type}</span>
                        <span className="mx-1">→</span>
                        <span className="font-medium">{selectedComponent.type}</span>
                      </>
                    )}
                  </div>

                  {connection.label && (
                    <div className="text-xs text-gray-500 mt-1">
                      Label: {connection.label}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Connection Types Info */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Connection Types</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-3 w-3 text-green-600" />
            <span>Data Flow: Pass data between components</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3 text-blue-600" />
            <span>Action: Trigger events/actions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-3 w-3 text-purple-600" />
            <span>Parent-Child: Hierarchical relationship</span>
          </div>
        </div>
      </div>
    </div>
  )
}
