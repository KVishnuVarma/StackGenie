import mongoose from 'mongoose';

// Define interface for connection points
const connectionPointSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, enum: ['input', 'output'], required: true },
    position: { type: String, enum: ['top', 'right', 'bottom', 'left'], required: true },
    connected: { type: Boolean, default: false },
    connectedTo: { type: String }, // ID of the connected point
}, { _id: false });

// Define interface for component connections
const connectionSchema = new mongoose.Schema({
    sourceId: { type: String, required: true }, // ID of source connection point
    targetId: { type: String, required: true }, // ID of target connection point
    sourceComponentId: { type: String, required: true },
    targetComponentId: { type: String, required: true },
}, { _id: false });

// Enhanced component schema to store drag-and-drop and connection properties
const componentSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., "Button", "Card"
    props: {
        name: { type: String, required: false },
        text: { type: String }, // For a button or text component
        color: { type: String }, // For styling
        position: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 }
        },
        // A generic 'style' object for more complex CSS
        style: {
            type: Object,
            default: {}
        }
    },
    connectionPoints: [connectionPointSchema],
    connections: [connectionSchema],
    code: { type: String }, // The code snippet for the component
}, { _id: false });

const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    status: { type: String, default: 'draft' },
    components: [componentSchema],
    // Add reference to Schema model
    schema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schema'
    }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);