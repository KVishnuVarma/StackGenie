import { useDroppable } from '@dnd-kit/core'
import { type Component } from '../services/api'
import { MousePointer, Square, Type, CreditCard, Image, List } from 'lucide-react'

interface CanvasProps {
  components: Component[]
  selectedComponent: Component | null
  onSelectComponent: (component: Component) => void
  onUpdateComponent: (index: number, updates: Partial<Component>) => void
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

const renderComponent = (component: Component, index: number, isSelected: boolean) => {
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

export default function Canvas({ 
  components, 
  selectedComponent, 
  onSelectComponent, 
  onUpdateComponent 
}: CanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  })

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
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{components.length} components</span>
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
        <div className="min-h-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <Square className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Canvas</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Drag components from the sidebar to start building your interface.
                You can arrange, style, and configure each component to create your perfect design.
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
                  {renderComponent(component, index, selectedComponent === component)}
                  
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
