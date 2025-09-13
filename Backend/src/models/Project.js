import mongoose from 'mongoose';


const componentSchema = new mongoose.Schema({
    type : String,
    props: Object,
    code: String,
}, { _id : false });

const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    status: { type: String, default: 'created' },
    components: [componentSchema]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);