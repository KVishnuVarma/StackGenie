import express from 'express';
import multer from 'multer';
import { protect } from '../middlewares/authMiddleware.js';
import {
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
} from '../controllers/apiController.js';
import { convertCode, processCodeFile } from '../controllers/aiController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// CRUD API endpoints
router.post('/components', createComponent);
router.get('/components', getAllComponents);
router.get('/components/:id', getComponentById);
router.put('/components/:id', updateComponent);
router.delete('/components/:id', deleteComponent);

// File upload configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Code conversion routes
router.post('/convert/code', convertCode);
router.post('/convert/file', upload.single('file'), processCodeFile);

export default router;