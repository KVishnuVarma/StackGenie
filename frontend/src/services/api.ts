import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Project {
  _id: string
  projectId: string
  projectName: string
  description: string
  status: string
  components: Component[]
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface Component {
  id?: string
  type: string
  props: {
    name?: string
    text?: string
    color?: string
    position: {
      x: number
      y: number
    }
    style: Record<string, any>
  }
  code?: string
}

export interface Schema {
  _id: string
  projectId: string
  tables: Table[]
  relationships: Relationship[]
}

export interface Table {
  name: string
  fields: Field[]
}

export interface Field {
  name: string
  type: string
  isRequired: boolean
  isUnique: boolean
  isId: boolean
  defaultValue?: any
  relations?: {
    relatedModel: string
    relationType: string
    field: string
  }
}

export interface Relationship {
  source: {
    table: string
    field: string
  }
  target: {
    table: string
    field: string
  }
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany'
}

export interface Deployment {
  _id: string
  projectId: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  frontend: {
    platform: string
    status: string
    url?: string
  }
  backend: {
    platform: string
    status: string
    database: string
  }
  createdAt: string
}

// Project API
export const projectAPI = {
  create: (data: { projectName: string; description: string; createdBy: { name: string; email: string } }) =>
    api.post('/projects', data),
  
  getAll: () => api.get('/projects'),
  
  getById: (projectId: string) => api.get(`/projects/${projectId}`),
  
  save: (projectId: string, components: Component[]) =>
    api.put(`/projects/${projectId}/save`, { components }),
  
  delete: (projectId: string) => api.delete(`/projects/${projectId}`),
  
  generate: (data: { prompt: string; userInfo: { name: string; email: string } }) =>
    api.post('/projects/generate', data),
}

// Schema API
export const schemaAPI = {
  get: (projectId: string) => api.get(`/projects/${projectId}/schema`),
  
  upsert: (projectId: string, data: { tables: Table[]; relationships: Relationship[] }) =>
    api.put(`/projects/${projectId}/schema`, data),
  
  addTable: (projectId: string, table: Table) =>
    api.post(`/projects/${projectId}/schema/tables`, { table }),
  
  updateTable: (projectId: string, tableName: string, updatedTable: Table) =>
    api.put(`/projects/${projectId}/schema/tables`, { tableName, updatedTable }),
  
  deleteTable: (projectId: string, tableName: string) =>
    api.delete(`/projects/${projectId}/schema/tables`, { data: { tableName } }),
  
  addRelationship: (projectId: string, relationship: Relationship) =>
    api.post(`/projects/${projectId}/schema/relationships`, relationship),
  
  deleteRelationship: (projectId: string, source: any, target: any) =>
    api.delete(`/projects/${projectId}/schema/relationships`, { data: { source, target } }),
  
  generatePrisma: (projectId: string) => api.get(`/projects/${projectId}/schema/generate`),
}

// Component API
export const componentAPI = {
  create: (data: { name: string; type: string; description: string; configuration: any; projectId: string }) =>
    api.post('/crud/components', data),
  
  getAll: () => api.get('/crud/components'),
  
  getById: (id: string) => api.get(`/crud/components/${id}`),
  
  update: (id: string, data: any) => api.put(`/crud/components/${id}`, data),
  
  delete: (id: string) => api.delete(`/crud/components/${id}`),
}

// AI API
export const aiAPI = {
  convertCode: (data: { code: string; language?: string }) =>
    api.post('/crud/convert/code', data),
  
  processFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/crud/convert/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Deployment API
export const deploymentAPI = {
  create: (data: { projectId: string; frontend: any; backend: any }) =>
    api.post('/deployments', data),
  
  getStatus: (deploymentId: string) => api.get(`/deployments/${deploymentId}/status`),
  
  getProjectDeployments: (projectId: string) => api.get(`/deployments/project/${projectId}`),
  
  cancel: (deploymentId: string) => api.post(`/deployments/${deploymentId}/cancel`),
  
  getLogs: (deploymentId: string) => api.get(`/deployments/${deploymentId}/logs`),
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
  
  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),
  
  resetPassword: (token: string, data: { password: string }) =>
    api.post(`/auth/reset-password/${token}`, data),
}

// Webhook API
export const webhookAPI = {
  register: (data: any) => api.post('/webhooks/register', data),
  
  list: () => api.get('/webhooks/list'),
  
  update: (id: string, data: any) => api.put(`/webhooks/${id}`, data),
  
  delete: (id: string) => api.delete(`/webhooks/${id}`),
  
  test: (id: string) => api.post(`/webhooks/test/${id}`),
}

// Custom API
export const customAPI = {
  generateStructure: (data: any) => api.post('/custom/generate-structure', data),
  
  analyzeCode: (data: any) => api.post('/custom/analyze', data),
  
  deployProject: (data: any) => api.post('/custom/deploy', data),
  
  validateSchema: (data: any) => api.post('/custom/validate-schema', data),
  
  generateDocs: (data: any) => api.post('/custom/generate-docs', data),
}

export default api
