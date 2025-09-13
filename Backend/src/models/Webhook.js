import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    events: [{ type: String, required: true }], // Array of events to trigger webhook
    headers: { type: Map, of: String }, // Custom headers
    method: { type: String, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], default: 'POST' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: String, required: true },
    retryConfig: {
        maxRetries: { type: Number, default: 3 },
        retryInterval: { type: Number, default: 60000 } // milliseconds
    },
    lastStatus: {
        success: { type: Boolean },
        statusCode: { type: Number },
        message: { type: String },
        timestamp: { type: Date }
    }
}, { timestamps: true });

export default mongoose.model('Webhook', webhookSchema);