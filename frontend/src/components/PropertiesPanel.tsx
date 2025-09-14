import { useState } from 'react'
import { Trash2, Copy, Eye, EyeOff } from 'lucide-react'
import { type Component } from '../services/api'

interface PropertiesPanelProps {
  component: Component
  onUpdate: (updates: Partial<Component>) => void
  onDelete: () => void
}

export default function PropertiesPanel({ component, onUpdate, onDelete }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content')

  const updateProp = (key: string, value: any) => {
    onUpdate({
      props: {
        ...component.props,
        [key]: value
      }
    })
  }

  const updateStyle = (key: string, value: any) => {
    onUpdate({
      props: {
        ...component.props,
        style: {
          ...component.props.style,
          [key]: value
        }
      }
    })
  }

  const duplicateComponent = () => {
    // This would need to be handled by the parent component
    console.log('Duplicate component')
  }

  return (
    <div className="h-full bg-white border-t border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{component.type}</h3>
            <p className="text-sm text-gray-500">Component Properties</p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={duplicateComponent}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { id: 'content', name: 'Content' },
            { id: 'style', name: 'Style' },
            { id: 'layout', name: 'Layout' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <input
                type="text"
                value={component.props.text || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter text content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component Name
              </label>
              <input
                type="text"
                value={component.props.name || ''}
                onChange={(e) => updateProp('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Component name"
              />
            </div>

            {component.type === 'Button' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Type
                </label>
                <select
                  value={component.props.style?.type || 'button'}
                  onChange={(e) => updateStyle('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="button">Button</option>
                  <option value="submit">Submit</option>
                  <option value="reset">Reset</option>
                </select>
              </div>
            )}

            {component.type === 'Input' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input Type
                  </label>
                  <select
                    value={component.props.style?.type || 'text'}
                    onChange={(e) => updateStyle('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="password">Password</option>
                    <option value="number">Number</option>
                    <option value="tel">Phone</option>
                    <option value="url">URL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => updateProp('text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter placeholder text"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={component.props.style?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={component.props.style?.color || '#000000'}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={parseInt(component.props.style?.fontSize) || 16}
                onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="8"
                max="72"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Padding
              </label>
              <input
                type="text"
                value={component.props.style?.padding || '8px'}
                onChange={(e) => updateStyle('padding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8px, 16px 24px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius
              </label>
              <input
                type="text"
                value={component.props.style?.borderRadius || '4px'}
                onChange={(e) => updateStyle('borderRadius', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 4px, 50%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border
              </label>
              <input
                type="text"
                value={component.props.style?.border || '1px solid #ccc'}
                onChange={(e) => updateStyle('border', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1px solid #ccc"
              />
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="text"
                  value={component.props.style?.width || 'auto'}
                  onChange={(e) => updateStyle('width', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 100px, 50%, auto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={component.props.style?.height || 'auto'}
                  onChange={(e) => updateStyle('height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 100px, auto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margin
              </label>
              <input
                type="text"
                value={component.props.style?.margin || '0'}
                onChange={(e) => updateStyle('margin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8px, 16px 24px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display
              </label>
              <select
                value={component.props.style?.display || 'block'}
                onChange={(e) => updateStyle('display', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="none">None</option>
              </select>
            </div>

            {component.props.style?.display === 'flex' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flex Direction
                </label>
                <select
                  value={component.props.style?.flexDirection || 'row'}
                  onChange={(e) => updateStyle('flexDirection', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                  <option value="row-reverse">Row Reverse</option>
                  <option value="column-reverse">Column Reverse</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Align
              </label>
              <select
                value={component.props.style?.textAlign || 'left'}
                onChange={(e) => updateStyle('textAlign', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
