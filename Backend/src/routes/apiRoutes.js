import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
} from '../controllers/apiController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// CRUD API endpoints
router.post('/components', createComponent);
router.get('/components', getAllComponents);
router.get('/components/:id', getComponentById);
router.put('/components/:id', updateComponent);
router.delete('/components/:id', deleteComponent);

export default router;