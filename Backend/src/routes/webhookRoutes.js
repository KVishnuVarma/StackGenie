import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
    registerWebhook,
    listWebhooks,
    updateWebhook,
    deleteWebhook,
    testWebhook
} from '../controllers/webhookController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Webhook endpoints
router.post('/register', registerWebhook);
router.get('/list', listWebhooks);
router.put('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);
router.post('/test/:id', testWebhook);

export default router;