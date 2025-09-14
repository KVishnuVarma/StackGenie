import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Code, 
  Database, 
  Zap,
  ArrowRight,
  Copy,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { projectAPI } from '../services/api'
import toast from 'react-hot-toast'

interface GeneratedProject {
  projectId: string
  projectName: string
  description: string
  components: any[]
}

const examplePrompts = [
  "Create a modern e-commerce website with product catalog, shopping cart, and user authentication",
  "Build a task management app with project boards, team collaboration, and real-time updates",
  "Design a portfolio website with project showcase, blog, and contact form",
  "Develop a restaurant website with menu, online ordering, and table reservation system",
  "Create a fitness tracking app with workout plans, progress charts, and social features",
  "Build a learning management system with courses, quizzes, and student progress tracking"
]

const features = [
  { icon: Code, name: "Frontend Components", description: "React components with modern styling" },
  { icon: Database, name: "Database Schema", description: "Complete data models and relationships" },
  { icon: FileText, name: "API Endpoints", description: "RESTful APIs with authentication" },
  { icon: Zap, name: "Deployment Ready", description: "Ready for production deployment" }
]

export default function AIGenerator() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null)
  const [generating, setGenerating] = useState(false)
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a project description')
      return
    }

    setGenerating(true)
    setStep('generating')

    try {
      const response = await projectAPI.generate({
        prompt,
        userInfo: {
          name: 'User', // This would come from auth context
          email: 'user@example.com'
        }
      })

      setGeneratedProject(response.data)
      setStep('result')
      toast.success('Project generated successfully!')
    } catch (error) {
      console.error('Failed to generate project:', error)
      toast.error('Failed to generate project')
      setStep('input')
    } finally {
      setGenerating(false)
    }
  }

  const handleUseProject = () => {
    if (generatedProject) {
      navigate(`/projects/${generatedProject.projectId}/builder`)
    }
  }

  const handleNewGeneration = () => {
    setGeneratedProject(null)
    setPrompt('')
    setStep('input')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Project Generator</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Describe your vision and let our AI create a complete full-stack application for you
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
            <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{feature.name}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {step === 'input' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-900 mb-4">
                Describe your project
              </label>
              <textarea
                id="prompt"
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Be specific about what you want to build. Include features, target audience, and any specific requirements..."
              />
              <p className="mt-2 text-sm text-gray-500">
                The more detailed your description, the better the generated project will be.
              </p>
            </div>

            {/* Example Prompts */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Example Prompts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <p className="text-sm text-gray-700">{example}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Project
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'generating' && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Project</h2>
              <p className="text-gray-600">
                Our AI is analyzing your requirements and creating a complete application structure...
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && generatedProject && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-900">Project Generated Successfully!</h3>
                <p className="text-green-700">Your application has been created and is ready to customize.</p>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedProject.projectName}</h2>
                <p className="text-gray-600">{generatedProject.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleNewGeneration}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Generate New Project"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Components Generated */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedProject.components.map((component, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Code className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{component.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{component.props?.description || 'Component description'}</p>
                    {component.props?.technology && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {component.props.technology}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUseProject}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Eye className="h-5 w-5 mr-2" />
                Open in Builder
              </button>
              <button
                onClick={() => copyToClipboard(JSON.stringify(generatedProject, null, 2))}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy Project Data
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Customize your components in the visual builder
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Design your database schema
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Deploy your application to production
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">💡 Tips for Better Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <ul className="space-y-1">
            <li>• Be specific about the type of application</li>
            <li>• Mention key features and functionality</li>
            <li>• Include target audience information</li>
          </ul>
          <ul className="space-y-1">
            <li>• Specify preferred technologies if any</li>
            <li>• Describe the user experience you want</li>
            <li>• Include any special requirements</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
