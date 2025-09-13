import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
    generateProjectStructure,
    analyzeCode,
    deployProject,
    validateSchema,
    generateDocs
} from '../controllers/customController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Custom business logic endpoints
router.post('/generate-structure', generateProjectStructure);
router.post('/analyze', analyzeCode);
router.post('/deploy', deployProject);
router.post('/validate-schema', validateSchema);
router.post('/generate-docs', generateDocs);

export default router;