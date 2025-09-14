import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

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
  get: (projectId: string) => api.get(`/schemas/${projectId}`),
  
  upsert: (projectId: string, data: { tables: Table[]; relationships: Relationship[] }) =>
    api.put(`/schemas/${projectId}`, data),
  
  addTable: (projectId: string, table: Table) =>
    api.post(`/schemas/${projectId}/tables`, { table }),
  
  updateTable: (projectId: string, tableName: string, updatedTable: Table) =>
    api.put(`/schemas/${projectId}/tables`, { tableName, updatedTable }),
  
  deleteTable: (projectId: string, tableName: string) =>
    api.delete(`/schemas/${projectId}/tables`, { data: { tableName } }),
  
  addRelationship: (projectId: string, relationship: Relationship) =>
    api.post(`/schemas/${projectId}/relationships`, relationship),
  
  deleteRelationship: (projectId: string, source: any, target: any) =>
    api.delete(`/schemas/${projectId}/relationships`, { data: { source, target } }),
  
  generatePrisma: (projectId: string) => api.get(`/schemas/${projectId}/generate`),
}

// Component API
export const componentAPI = {
  create: (data: { name: string; type: string; description: string; configuration: any; projectId: string }) =>
    api.post('/api/components', data),
  
  getAll: () => api.get('/api/components'),
  
  getById: (id: string) => api.get(`/api/components/${id}`),
  
  update: (id: string, data: any) => api.put(`/api/components/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/components/${id}`),
}

// AI API
export const aiAPI = {
  convertCode: (data: { code: string; language?: string }) =>
    api.post('/api/convert/code', data),
  
  processFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/convert/file', formData, {
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

export default api
