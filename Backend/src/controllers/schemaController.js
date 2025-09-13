import Schema from '../models/Schema.js';
import { responseHandler } from '../utils/responseHandler.js';

// Create or update schema for a project
export const upsertSchema = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { tables, relationships } = req.body;

        if (!projectId) {
            return responseHandler.badRequest(res, 'Project ID is required');
        }

        // Create the update data with projectId
        const updateData = {
            projectId: projectId,
            tables: tables || [],
            relationships: relationships || []
        };


        const schema = await Schema.findOneAndUpdate(
            { projectId },
            updateData,
            { 
                new: true, 
                upsert: true,
                runValidators: true // This ensures mongoose validates the update
            }
        );

        responseHandler.success(res, 'Schema updated successfully', schema);
    } catch (error) {
        responseHandler.error(res, 'Failed to update schema', error);
    }
};

// Get schema for a project
export const getSchema = async (req, res) => {
    try {
        const { projectId } = req.params;

        const schema = await Schema.findOne({ projectId });
        console.log('Found Schema:', schema ? 'Yes' : 'No');
        if (schema) {
        }

        if (!schema) {
            return responseHandler.notFound(res, 'Schema not found');
        }

        responseHandler.success(res, 'Schema retrieved successfully', schema);
    } catch (error) {
        console.error('Schema Get Error:', error);
        responseHandler.error(res, 'Failed to retrieve schema', error);
    }
};

// Add table to schema
export const addTable = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { table } = req.body;

        const schema = await Schema.findOneAndUpdate(
            { projectId },
            { $push: { tables: table } },
            { new: true }
        );

        if (!schema) {
            return responseHandler.notFound(res, 'Schema not found');
        }

        responseHandler.success(res, 'Table added successfully', schema);
    } catch (error) {
        responseHandler.error(res, 'Failed to add table', error);
    }
};

// Update table in schema
export const updateTable = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { tableName, updatedTable } = req.body;

        const schema = await Schema.findOneAndUpdate(
            { projectId, 'tables.name': tableName },
            { $set: { 'tables.$': updatedTable } },
            { new: true }
        );

        if (!schema) {
            return responseHandler.notFound(res, 'Schema or table not found');
        }

        responseHandler.success(res, 'Table updated successfully', schema);
    } catch (error) {
        responseHandler.error(res, 'Failed to update table', error);
    }
};

// Delete table from schema
export const deleteTable = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { tableName } = req.body;

        const schema = await Schema.findOneAndUpdate(
            { projectId },
            { $pull: { tables: { name: tableName } } },
            { new: true }
        );

        if (!schema) {
            return responseHandler.notFound(res, 'Schema not found');
        }

        responseHandler.success(res, 'Table deleted successfully', schema);
    } catch (error) {
        responseHandler.error(res, 'Failed to delete table', error);
    }
};

// Add relationship to schema
export const addRelationship = async (req, res) => {
    try {
        const { projectId } = req.params;
        const relationship = req.body;

        const schema = await Schema.findOneAndUpdate(
            { projectId },
            { $push: { relationships: relationship } },
            { new: true }
        );

        if (!schema) {
            return responseHandler.notFound(res, 'Schema not found');
        }

        responseHandler.success(res, 'Relationship added successfully', schema);
    } catch (error) {
        responseHandler.error(res, 'Failed to add relationship', error);
    }
};

// Delete relationship from schema
export const deleteRelationship = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { source, target } = req.body;

        const schema = await Schema.findOneAndUpdate(
            { projectId },
            { 
                $pull: { 
                    relationships: {
                        'source.table': source.table,
                        'source.field': source.field,
                        'target.table': target.table,
                        'target.field': target.field
                    }
                }
            },
            { new: true }
        );

        if (!schema) {
            return responseHandler.notFound(res, 'Schema not found');
        }

        responseHandler.success(res, 'Relationship deleted successfully', schema);
    } catch (error) {
        responseHandler.error(res, 'Failed to delete relationship', error);
    }
};

// Generate Prisma schema
export const generatePrismaSchema = async (req, res) => {
    try {
        const { projectId } = req.params;
        const schema = await Schema.findOne({ projectId });

        if (!schema) {
            return responseHandler.notFound(res, 'Schema not found');
        }

        let prismaSchema = '';

        // Generate model definitions
        for (const table of schema.tables) {
            prismaSchema += `model ${table.name} {\n`;
            
            // Add fields
            for (const field of table.fields) {
                let fieldDef = `  ${field.name} ${field.type}`;
                
                // Add modifiers
                if (field.isId) fieldDef += ' @id';
                if (field.isUnique) fieldDef += ' @unique';
                if (field.defaultValue !== undefined) {
                    if (typeof field.defaultValue === 'string') {
                        fieldDef += ` @default("${field.defaultValue}")`;
                    } else {
                        fieldDef += ` @default(${field.defaultValue})`;
                    }
                }
                if (!field.isRequired) fieldDef += '?';
                
                prismaSchema += fieldDef + '\n';
            }
            
            prismaSchema += '}\n\n';
        }

        // Add relationships
        for (const rel of schema.relationships) {
            // Implementation depends on your relationship structure
            // This is a simplified version
            prismaSchema = prismaSchema.replace(
                `model ${rel.source.table} {`,
                `model ${rel.source.table} {\n  ${rel.target.table} ${
                    rel.type === 'oneToMany' ? rel.target.table + '[]' : rel.target.table
                } @relation(fields: [${rel.source.field}], references: [${rel.target.field}])`
            );
        }

        responseHandler.success(res, 'Prisma schema generated successfully', { schema: prismaSchema });
    } catch (error) {
        responseHandler.error(res, 'Failed to generate Prisma schema', error);
    }
};