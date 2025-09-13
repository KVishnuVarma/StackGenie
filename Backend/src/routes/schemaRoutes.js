import express from 'express';
import {
    upsertSchema,
    getSchema,
    addTable,
    updateTable,
    deleteTable,
    addRelationship,
    deleteRelationship,
    generatePrismaSchema
} from '../controllers/schemaController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // Add mergeParams: true to access parent route params

// Apply authentication middleware to all routes
router.use(protect);

// Schema CRUD operations
router.get('/', getSchema);
router.put('/', upsertSchema);

// Table operations
router.post('/tables', addTable);
router.put('/tables', updateTable);
router.delete('/tables', deleteTable);

// Relationship operations
router.post('/relationships', addRelationship);
router.delete('/relationships', deleteRelationship);

// Generate Prisma schema
router.get('/generate', generatePrismaSchema);

export default router;