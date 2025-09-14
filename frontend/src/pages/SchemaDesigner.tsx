import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Plus, 
  Save, 
  Database, 
  Table, 
  Key, 
  Link, 
  Trash2, 
  Edit3,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react'
import { schemaAPI, type Schema, type Table as TableType, type Field, type Relationship } from '../services/api'
import toast from 'react-hot-toast'

export default function SchemaDesigner() {
  const { projectId } = useParams<{ projectId: string }>()
  const [schema, setSchema] = useState<Schema | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddTable, setShowAddTable] = useState(false)
  const [showAddField, setShowAddField] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [newTable, setNewTable] = useState({ name: '', fields: [] })
  const [newField, setNewField] = useState<Partial<Field>>({
    name: '',
    type: 'String',
    isRequired: false,
    isUnique: false,
    isId: false
  })

  useEffect(() => {
    if (projectId) {
      loadSchema()
    }
  }, [projectId])

  const loadSchema = async () => {
    try {
      const response = await schemaAPI.get(projectId!)
      setSchema(response.data)
    } catch (error) {
      console.error('Failed to load schema:', error)
      toast.error('Failed to load schema')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await schemaAPI.upsert(projectId!, {
        tables: schema?.tables || [],
        relationships: schema?.relationships || []
      })
      toast.success('Schema saved successfully!')
    } catch (error) {
      console.error('Failed to save schema:', error)
      toast.error('Failed to save schema')
    } finally {
      setSaving(false)
    }
  }

  const addTable = () => {
    if (!newTable.name.trim()) {
      toast.error('Table name is required')
      return
    }

    const table: TableType = {
      name: newTable.name,
      fields: [
        {
          name: 'id',
          type: 'ObjectId',
          isRequired: true,
          isUnique: true,
          isId: true
        }
      ]
    }

    setSchema({
      ...schema!,
      tables: [...(schema?.tables || []), table]
    })

    setNewTable({ name: '', fields: [] })
    setShowAddTable(false)
    toast.success('Table added successfully!')
  }

  const addField = () => {
    if (!selectedTable || !newField.name?.trim()) {
      toast.error('Field name is required')
      return
    }

    const updatedTables = schema?.tables.map(table => {
      if (table.name === selectedTable) {
        return {
          ...table,
          fields: [...table.fields, newField as Field]
        }
      }
      return table
    }) || []

    setSchema({
      ...schema!,
      tables: updatedTables
    })

    setNewField({
      name: '',
      type: 'String',
      isRequired: false,
      isUnique: false,
      isId: false
    })
    setShowAddField(false)
    toast.success('Field added successfully!')
  }

  const deleteTable = (tableName: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      setSchema({
        ...schema!,
        tables: schema?.tables.filter(t => t.name !== tableName) || [],
        relationships: schema?.relationships.filter(r => 
          r.source.table !== tableName && r.target.table !== tableName
        ) || []
      })
      toast.success('Table deleted successfully!')
    }
  }

  const deleteField = (tableName: string, fieldName: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      const updatedTables = schema?.tables.map(table => {
        if (table.name === tableName) {
          return {
            ...table,
            fields: table.fields.filter(f => f.name !== fieldName)
          }
        }
        return table
      }) || []

      setSchema({
        ...schema!,
        tables: updatedTables
      })
      toast.success('Field deleted successfully!')
    }
  }

  const generatePrismaSchema = async () => {
    try {
      const response = await schemaAPI.generatePrisma(projectId!)
      const prismaSchema = response.data.schema
      
      // Copy to clipboard
      navigator.clipboard.writeText(prismaSchema)
      toast.success('Prisma schema copied to clipboard!')
    } catch (error) {
      console.error('Failed to generate Prisma schema:', error)
      toast.error('Failed to generate Prisma schema')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Schema Designer</h1>
            <p className="mt-2 text-gray-600">
              Design your database structure with visual tools
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generatePrismaSchema}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Prisma
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Schema'}
          </button>
        </div>
      </div>

      {/* Schema Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Schema Overview</h2>
          <button
            onClick={() => setShowAddTable(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </button>
        </div>
        
        {schema?.tables.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables yet</h3>
            <p className="text-gray-500 mb-4">Start by creating your first table</p>
            <button
              onClick={() => setShowAddTable(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {schema?.tables.map((table) => (
              <div key={table.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Table className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{table.name}</h3>
                  </div>
                  <button
                    onClick={() => deleteTable(table.name)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  {table.fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        {field.isId && <Key className="h-3 w-3 text-yellow-600 mr-1" />}
                        {field.isUnique && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded mr-1">U</span>}
                        <span className="font-medium text-sm">{field.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{field.type}</span>
                        {field.isRequired && <span className="text-xs text-red-600 ml-1">*</span>}
                      </div>
                      <button
                        onClick={() => deleteField(table.name, field.name)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedTable(table.name)
                    setShowAddField(true)
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  + Add Field
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Relationships */}
      {schema?.relationships && schema.relationships.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Relationships</h2>
          <div className="space-y-2">
            {schema.relationships.map((rel, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Link className="h-4 w-4 text-gray-400 mr-3" />
                <span className="font-medium">{rel.source.table}.{rel.source.field}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="font-medium">{rel.target.table}.{rel.target.field}</span>
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {rel.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Table</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  value={newTable.name}
                  onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., users, posts, orders"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTable(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addTable}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddField && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Field to {selectedTable}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={newField.name || ''}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., email, title, created_at"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Type
                </label>
                <select
                  value={newField.type || 'String'}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  <option value="Boolean">Boolean</option>
                  <option value="Date">Date</option>
                  <option value="ObjectId">ObjectId</option>
                  <option value="Array">Array</option>
                  <option value="Object">Object</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newField.isRequired || false}
                    onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
                    className="mr-2"
                  />
                  Required
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newField.isUnique || false}
                    onChange={(e) => setNewField({ ...newField, isUnique: e.target.checked })}
                    className="mr-2"
                  />
                  Unique
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newField.isId || false}
                    onChange={(e) => setNewField({ ...newField, isId: e.target.checked })}
                    className="mr-2"
                  />
                  Primary Key
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddField(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addField}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
