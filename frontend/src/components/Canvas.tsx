import { useDroppable } from '@dnd-kit/core'
import { type Component, type Connection } from '../types/component'
import { MousePointer, Square, Type, CreditCard, Image, List } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import ConnectionComponent from './Connection' // Renamed to avoid conflict with imported type
import ConnectionPoint from './ConnectionPoint'
import { useConnectionDrag } from '../hooks/useConnectionDrag'

// Removed the following incorrect interface definition
// Corrected interface definition
interface LocalConnection { // Added 'interface' keyword and a name
  id: string
  from: string
  to: string
  type: 'data' | 'action' | 'parent-child'
  label?: string
}

interface CanvasProps {
  components: Component[]
  selectedComponent: Component | null
  onSelectComponent: (component: Component) => void
  onUpdateComponent: (index: number, updates: Partial<Component>) => void
  connections: Connection[]
  onRemoveConnection: (connectionId: string) => void
}

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'Button': return MousePointer
    case 'Text': return Type
    case 'Card': return CreditCard
    case 'Input': return Square
    case 'Image': return Image
    case 'List': return List
    default: return Square
  }
}

const renderComponent = (component: Component, index: number, isSelected: boolean, connections: Connection[]) => {
  const { type, props } = component
  const { text, style } = props
  const Icon = getComponentIcon(type)

  const baseStyle = {
    ...style,
    position: 'relative' as const,
    cursor: 'pointer',
    border: isSelected ? '2px solid #3B82F6' : '2px solid transparent',
    outline: 'none'
  }

  // Get connections for this component
  const componentConnections = connections.filter(
    conn => conn.from === component.id || conn.to === component.id
  )

  const renderComponentContent = () => {
    switch (type) { 
      case 'Button':
        return (
          <button
            key={index}
            style={baseStyle}
            className="hover:shadow-md transition-shadow"
          >
            {text}
          </button>
        )
      case 'Card':
        return (
          <div
            key={index}
            style={baseStyle}
            className="hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">{type}</span>
            </div>
            <div>{text}</div>
          </div>
        )
      case 'Text':
        return (
          <p
            key={index}
            style={baseStyle}
            className="hover:shadow-md transition-shadow"
          >
            {text}
          </p>
        )
      case 'Input':
        return (
          <input
            key={index}
            style={baseStyle}
            placeholder={text}
            className="hover:shadow-md transition-shadow"
            readOnly
          />
        )
      case 'Image':
        return (
          <div
            key={index}
            style={baseStyle}
            className="hover:shadow-md transition-shadow bg-gray-100 flex items-center justify-center"
          >
            <div className="text-center">
              <Icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Image Placeholder</p>
              <p className="text-xs text-gray-400">{text}</p>
            </div>
          </div>
        )
      case 'List':
        return (
          <div
            key={index}
            style={baseStyle}
            className="hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">{type}</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
          </div>
        )
      default:
        return (
          <div
            key={index}
            style={baseStyle}
            className="hover:shadow-md transition-shadow bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center"
          >
            <div className="text-center">
              <Icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{type}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative">
      {renderComponentContent()}
      
      {/* Connection Points */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {/* Output Connection Point */}
          <div className="relative group">
            <div className="w-3 h-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                 title="Output connection point">
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Connect output
            </div>
          </div>
          
          {/* Input Connection Point */}
          <div className="relative group">
            <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
                 title="Input connection point">
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Connect input
            </div>
          </div>
        </div>
      )}

      {/* Connection Indicators */}
      {componentConnections.length > 0 && (
        <div className="absolute -top-1 -left-1 flex space-x-1">
          {componentConnections.map((conn, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                conn.type === 'data' ? 'bg-green-400' :
                conn.type === 'action' ? 'bg-blue-400' :
                'bg-purple-400'
              }`}
              title={`${conn.type} connection`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Canvas({ 
  components, 
  selectedComponent, 
  onSelectComponent, 
  onUpdateComponent,
  connections,
  onRemoveConnection
}: CanvasProps): React.ReactElement {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  })

  const canvasRef = useRef<HTMLDivElement>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ componentId: string; point: 'input' | 'output' } | null>(null)

  // Render connection lines
  const renderConnections = () => {
    return connections.map((connection) => {
      const fromComponent = components.find(c => c.id === connection.from)
      const toComponent = components.find(c => c.id === connection.to)
      
      if (!fromComponent || !toComponent) return null

      const fromPos = {
        x: fromComponent.props.position?.x || 0,
        y: fromComponent.props.position?.y || 0
      }
      const toPos = {
        x: toComponent.props.position?.x || 0,
        y: toComponent.props.position?.y || 0
      }

      const color = connection.type === 'data' ? '#10B981' : 
                   connection.type === 'action' ? '#3B82F6' : '#8B5CF6'

      return (
        <svg
          key={connection.id}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id={`arrowhead-${connection.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={color}
              />
            </marker>
          </defs>
          <path
            d={`M ${fromPos.x + 100} ${fromPos.y + 20} Q ${(fromPos.x + toPos.x) / 2 + 50} ${Math.min(fromPos.y, toPos.y) - 50} ${toPos.x + 100} ${toPos.y + 20}`}
            stroke={color}
            strokeWidth="2"
            fill="none"
            markerEnd={`url(#arrowhead-${connection.id})`}
            strokeDasharray={connection.type === 'parent-child' ? '5,5' : 'none'}
          />
          {connection.label && (
            <text
              x={(fromPos.x + toPos.x) / 2 + 50}
              y={Math.min(fromPos.y, toPos.y) - 60}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {connection.label}
            </text>
          )}
        </svg>
      )
    })
  }

  return (
    <div className="flex-1 bg-gray-100 relative">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Canvas</h2>
            <p className="text-sm text-gray-500">
              Drag components here to build your interface
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{components.length} components</span>
            <span>{connections.length} connections</span>
            {isConnecting && (
              <span className="text-blue-600 font-medium">Connecting...</span>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={setNodeRef}
        className={`h-full overflow-auto p-8 transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-gray-50'
        }`}
      >
        <div 
          ref={canvasRef}
          className="min-h-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative"
        >
          {/* Connection Lines */}
          {renderConnections()}

          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <Square className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Canvas</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Drag components from the sidebar to start building your interface.
                You can arrange, style, and connect components to create interactive flows.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {components.map((component, index) => (
                <div
                  key={index}
                  onClick={() => onSelectComponent(component)}
                  className={`transition-all duration-200 ${
                    selectedComponent === component ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  {renderComponent(component, index, selectedComponent === component, connections)}
                  
                  {/* Component Controls */}
                  {selectedComponent === component && (
                    <div className="absolute -top-2 -right-2 flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onUpdateComponent(index, {
                            props: {
                              ...component.props,
                              position: {
                                ...component.props.position,
                                x: component.props.position.x + 10
                              }
                            }
                          })
                        }}
                        className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Move right"
                      >
                        →
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onUpdateComponent(index, {
                            props: {
                              ...component.props,
                              position: {
                                ...component.props.position,
                                y: component.props.position.y + 10
                              }
                            }
                          })
                        }}
                        className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}