import Deployment from '../models/Deployment.js';
import Project from '../models/Project.js';
import { responseHandler } from '../utils/responseHandler.js';

const deploymentController = {
    // Create a new deployment
        createDeployment: async (req, res) => {
        try {
            const { projectId, frontend, backend } = req.body;
            
            // Check if user is authenticated
            if (!req.user || !req.user._id) {
                return responseHandler.error(res, 401, 'User not authenticated');
            }
            const userId = req.user._id;

            // First validate the projectId format
            if (!projectId) {
                return responseHandler.error(res, 400, 'Project ID is required');
            }

            let project;
            try {
                project = await Project.findOne({ projectId: projectId });
            } catch (error) {
                console.error('Project lookup error:', error);
                return responseHandler.error(res, 400, 'Invalid project ID format');
            }
            
            if (!project) {
                return responseHandler.error(res, 404, 'Project not found. Please check the project ID');
            }
            
            if (!project.userId || project.userId.toString() !== userId.toString()) {
                return responseHandler.error(res, 403, {
                    message: 'You do not have permission to deploy this project',
                    debug: {
                        projectUserId: project.userId ? project.userId.toString() : 'undefined',
                        requestUserId: userId.toString()
                    }
                });
            }

            // Validate frontend and backend configurations
            if (!frontend || !backend) {
                return responseHandler.error(res, 400, 'Both frontend and backend configurations are required');
            }

            const deployment = new Deployment({
                projectId: project._id,
                userId,
                frontend,
                backend,
                status: 'pending'
            });

            await deployment.save();

            return responseHandler.success(res, 201, 'Deployment initiated successfully', deployment);
        } catch (error) {
            console.error('Error in createDeployment:', error);
            return responseHandler.error(res, 500, 'Error creating deployment');
        }
    },

    // Get deployment status
    getDeploymentStatus: async (req, res) => {
        try {
            const { deploymentId } = req.params;
            const userId = req.user._id;  // Changed from user.id to user._id

            const deployment = await Deployment.findOne({ _id: deploymentId, userId });
            if (!deployment) {
                return responseHandler.error(res, 404, 'Deployment not found');
            }

            return responseHandler.success(res, 200, 'Deployment status retrieved', deployment);
        } catch (error) {
            console.error('Error in getDeploymentStatus:', error);
            return responseHandler.error(res, 500, 'Error getting deployment status');
        }
    },

    // List all deployments for a project
    listProjectDeployments: async (req, res) => {
        try {
            const { projectId } = req.params;
            const userId = req.user._id;  // Changed from user.id to user._id

            // First find the project by its public ID
            const project = await Project.findOne({ projectId: projectId });
            if (!project) {
                return responseHandler.error(res, 404, 'Project not found');
            }

            // Then find deployments using the project's MongoDB _id
            const deployments = await Deployment.find({ 
                projectId: project._id,
                userId: userId 
            })
            .sort({ createdAt: -1 })
            .populate('projectId', 'projectId projectName'); // Include project details

            // Transform the response to include readable project information
            const formattedDeployments = deployments.map(deployment => ({
                _id: deployment._id,
                status: deployment.status,
                frontend: deployment.frontend,
                backend: deployment.backend,
                projectDetails: {
                    projectId: project.projectId,
                    projectName: project.projectName
                },
                createdAt: deployment.createdAt,
                updatedAt: deployment.updatedAt
            }));

            return responseHandler.success(res, 200, 'Deployments retrieved successfully', formattedDeployments);
        } catch (error) {
            console.error('Error in listProjectDeployments:', error);
            return responseHandler.error(res, 500, 'Error listing deployments');
        }
    },

    // Cancel deployment
    cancelDeployment: async (req, res) => {
        try {
            const { deploymentId } = req.params;
            const userId = req.user._id;  // Changed from user.id to user._id

            const deployment = await Deployment.findOne({ _id: deploymentId, userId });
            if (!deployment) {
                return responseHandler.error(res, 404, 'Deployment not found');
            }

            if (deployment.status === 'completed' || deployment.status === 'failed') {
                return responseHandler.error(res, 400, 'Deployment cannot be cancelled in current state');
            }

            deployment.status = 'failed';
            deployment.frontend.status = 'failed';
            deployment.backend.status = 'failed';
            await deployment.save();

            return responseHandler.success(res, 200, 'Deployment cancelled successfully', deployment);
        } catch (error) {
            console.error('Error in cancelDeployment:', error);
            return responseHandler.error(res, 500, 'Error cancelling deployment');
        }
    },

    // Get deployment logs (this would be integrated with actual deployment platforms)
    getDeploymentLogs: async (req, res) => {
        try {
            const { deploymentId } = req.params;
            const userId = req.user._id;  // Changed from user.id to user._id

            const deployment = await Deployment.findOne({ _id: deploymentId, userId });
            if (!deployment) {
                return responseHandler.error(res, 404, 'Deployment not found');
            }

            // TODO: Implement actual log retrieval from deployment platforms
            const mockLogs = {
                frontend: ['Building frontend...', 'Installing dependencies...', 'Build completed'],
                backend: ['Setting up backend...', 'Configuring database...', 'Deployment successful']
            };

            return responseHandler.success(res, 200, 'Deployment logs retrieved', mockLogs);
        } catch (error) {
            console.error('Error in getDeploymentLogs:', error);
            return responseHandler.error(res, 500, 'Error retrieving deployment logs');
        }
    }
};

export default deploymentController;