import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    configuration: { type: Object, default: {} },
    status: { type: String, default: 'active' },
    version: { type: String, default: '1.0.0' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Component', componentSchema);
