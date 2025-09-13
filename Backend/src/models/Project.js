import mongoose from 'mongoose';

// Enhanced component schema to store drag-and-drop properties
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
    code: { type: String }, // The code snippet for the component
}, { _id: false });

const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    description: { type: String, required: true },
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