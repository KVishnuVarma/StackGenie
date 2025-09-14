import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, ArrowLeft, Sparkles } from 'lucide-react'
import { projectAPI } from '../services/api'
import toast from 'react-hot-toast'

interface CreateProjectForm {
  projectName: string
  description: string
  createdBy: {
    name: string
    email: string
  }
}

export default function CreateProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateProjectForm>({
    defaultValues: {
      createdBy: {
        name: 'User', // This would come from auth context
        email: 'user@example.com'
      }
    }
  })

  const onSubmit = async (data: CreateProjectForm) => {
    setLoading(true)
    try {
      if (useAI && aiPrompt) {
        // Use AI generation
        const response = await projectAPI.generate({
          prompt: aiPrompt,
          userInfo: data.createdBy
        })
        toast.success('Project generated successfully!')
        navigate(`/projects/${response.data.projectId}/builder`)
      } else {
        // Create regular project
        const response = await projectAPI.create(data)
        toast.success('Project created successfully!')
        navigate(`/projects/${response.data.projectId}/builder`)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">
            Start building your next application with StackGenie
          </p>
        </div>
      </div>

      {/* AI Toggle */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">AI-Powered Generation</h3>
              <p className="text-gray-600">Let AI help you create your project structure</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUseAI(!useAI)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useAI ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useAI ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              {...register('projectName', { required: 'Project name is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your project name"
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what your project does..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* AI Prompt */}
          {useAI && (
            <div>
              <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700">
                AI Prompt
              </label>
              <textarea
                id="aiPrompt"
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe what you want to build in detail. For example: 'Create a task management app with user authentication, project boards, and real-time collaboration features'"
              />
              <p className="mt-1 text-sm text-gray-500">
                Be specific about features, technologies, and requirements for better results.
              </p>
            </div>
          )}

          {/* Creator Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="createdByName" className="block text-sm font-medium text-gray-700">
                Creator Name
              </label>
              <input
                type="text"
                id="createdByName"
                {...register('createdBy.name', { required: 'Name is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
              {errors.createdBy?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.createdBy.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="createdByEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="createdByEmail"
                {...register('createdBy.email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
              {errors.createdBy?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.createdBy.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              useAI 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {useAI ? 'Generating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center">
                {useAI ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </>
                )}
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips for better results</h3>
        <ul className="text-blue-800 space-y-1">
          <li>• Be specific about the type of application you want to build</li>
          <li>• Mention key features and functionality requirements</li>
          <li>• Include any specific technologies or frameworks you prefer</li>
          <li>• Describe the target audience and use cases</li>
        </ul>
      </div>
    </div>
  )
}
