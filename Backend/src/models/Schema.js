import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    isRequired: { type: Boolean, default: false },
    isUnique: { type: Boolean, default: false },
    isId: { type: Boolean, default: false },
    defaultValue: { type: mongoose.Schema.Types.Mixed },
    relations: {
        type: {
            relatedModel: { type: String },
            relationType: { type: String, enum: ['oneToOne', 'oneToMany', 'manyToOne', 'manyToMany'] },
            field: { type: String }
        },
        required: false
    }
}, { _id: false });

const tableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fields: [fieldSchema]
}, { _id: false });

const schemaSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    tables: [tableSchema],
    relationships: [{
        source: {
            table: { type: String, required: true },
            field: { type: String, required: true }
        },
        target: {
            table: { type: String, required: true },
            field: { type: String, required: true }
        },
        type: { 
            type: String, 
            required: true,
            enum: ['oneToOne', 'oneToMany', 'manyToOne', 'manyToMany']
        }
    }]
}, { timestamps: true });

export default mongoose.model('Schema', schemaSchema);