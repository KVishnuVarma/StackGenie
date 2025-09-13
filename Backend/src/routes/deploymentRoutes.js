import express from 'express';

import deploymentController from '../controllers/deploymentController.js';
import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all deployment routes with authentication
router.use(protect);

// Create a new deployment
router.post('/', deploymentController.createDeployment);

// Get deployment status
router.get('/:deploymentId/status', deploymentController.getDeploymentStatus);

// List all deployments for a project
router.get('/project/:projectId', deploymentController.listProjectDeployments);

// Cancel deployment
router.post('/:deploymentId/cancel', deploymentController.cancelDeployment);

// Get deployment logs
router.get('/:deploymentId/logs', deploymentController.getDeploymentLogs);

export default router;