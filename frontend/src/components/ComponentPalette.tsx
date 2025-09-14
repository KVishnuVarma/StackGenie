import { useDraggable } from '@dnd-kit/core'
import { 
  Square, 
  Type, 
  MousePointer, 
  CreditCard, 
  Image, 
  List,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  MessageSquare,
  Upload,
  Download,
  Search,
  Filter,
  Menu,
  X,
  Check,
  AlertCircle,
  Info,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

interface DraggableComponentProps {
  type: string
  icon: React.ComponentType<any>
  description: string
  category: string
}

const componentCategories = {
  'Basic': [
    { type: 'Button', icon: MousePointer, description: 'Interactive button element' },
    { type: 'Text', icon: Type, description: 'Text content block' },
    { type: 'Input', icon: Square, description: 'Text input field' },
    { type: 'Card', icon: CreditCard, description: 'Content container card' },
    { type: 'Image', icon: Image, description: 'Image display element' },
    { type: 'List', icon: List, description: 'List of items' },
  ],
  'Forms': [
    { type: 'EmailInput', icon: Mail, description: 'Email input field' },
    { type: 'PhoneInput', icon: Phone, description: 'Phone number input' },
    { type: 'TextArea', icon: Type, description: 'Multi-line text input' },
    { type: 'Select', icon: List, description: 'Dropdown selection' },
    { type: 'Checkbox', icon: Check, description: 'Checkbox input' },
    { type: 'Radio', icon: MousePointer, description: 'Radio button input' },
  ],
  'Layout': [
    { type: 'Container', icon: Square, description: 'Layout container' },
    { type: 'Row', icon: Square, description: 'Horizontal row' },
    { type: 'Column', icon: Square, description: 'Vertical column' },
    { type: 'Grid', icon: Square, description: 'Grid layout' },
    { type: 'Flex', icon: Square, description: 'Flexbox container' },
    { type: 'Spacer', icon: Square, description: 'Empty space' },
  ],
  'Navigation': [
    { type: 'Navbar', icon: Menu, description: 'Navigation bar' },
    { type: 'Breadcrumb', icon: Square, description: 'Breadcrumb navigation' },
    { type: 'Pagination', icon: Square, description: 'Page navigation' },
    { type: 'Tabs', icon: Square, description: 'Tab navigation' },
    { type: 'Sidebar', icon: Menu, description: 'Side navigation' },
  ],
  'Media': [
    { type: 'Video', icon: Square, description: 'Video player' },
    { type: 'Audio', icon: Square, description: 'Audio player' },
    { type: 'Gallery', icon: Image, description: 'Image gallery' },
    { type: 'Carousel', icon: Square, description: 'Image carousel' },
  ],
  'Interactive': [
    { type: 'Modal', icon: Square, description: 'Modal dialog' },
    { type: 'Tooltip', icon: Info, description: 'Tooltip element' },
    { type: 'Dropdown', icon: Square, description: 'Dropdown menu' },
    { type: 'Accordion', icon: Square, description: 'Collapsible content' },
    { type: 'Slider', icon: Square, description: 'Range slider' },
    { type: 'Rating', icon: Star, description: 'Star rating' },
  ],
  'Feedback': [
    { type: 'Alert', icon: AlertCircle, description: 'Alert message' },
    { type: 'Toast', icon: Info, description: 'Toast notification' },
    { type: 'Progress', icon: Square, description: 'Progress bar' },
    { type: 'Loading', icon: Square, description: 'Loading spinner' },
    { type: 'Badge', icon: Star, description: 'Status badge' },
  ],
  'Data': [
    { type: 'Table', icon: Square, description: 'Data table' },
    { type: 'Chart', icon: Square, description: 'Data visualization' },
    { type: 'Calendar', icon: Calendar, description: 'Calendar widget' },
    { type: 'Search', icon: Search, description: 'Search input' },
    { type: 'Filter', icon: Filter, description: 'Filter controls' },
  ]
}

function DraggableComponent({ type, icon: Icon, description }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${type}`,
    data: {
      type,
      source: 'palette'
    }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{type}</p>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function ComponentPalette() {
  return (
    <div className="p-4 space-y-6">
      {Object.entries(componentCategories).map(([category, components]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-900 mb-3">{category}</h4>
          <div className="space-y-2">
            {components.map((component) => (
              <DraggableComponent
                key={component.type}
                type={component.type}
                icon={component.icon}
                description={component.description}
                category={category}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
