import mongoose from 'mongoose';

const deploymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    frontend: {
        platform: {
            type: String,
            enum: ['Vercel', 'Netlify', 'Custom'],
            required: true
        },
        buildTime: {
            type: String,
            default: '~2 minutes'
        },
        url: String,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'failed'],
            default: 'pending'
        },
        cdnEnabled: {
            type: Boolean,
            default: true
        }
    },
    backend: {
        platform: {
            type: String,
            enum: ['Render', 'Heroku', 'Custom'],
            required: true
        },
        database: {
            type: String,
            enum: ['PostgreSQL', 'MongoDB', 'MySQL'],
            required: true
        },
        autoScaling: {
            type: Boolean,
            default: true
        },
        url: String,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'failed'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Deployment = mongoose.model('Deployment', deploymentSchema);
export default Deployment;