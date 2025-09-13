import Component from '../models/Component.js';
import { responseHandler } from '../utils/responseHandler.js';

// Create a new component
export const createComponent = async (req, res) => {
    try {
        const { name, type, description, configuration, projectId } = req.body;

        // Validate required fields
        if (!name || !type || !description || !projectId) {
            return responseHandler.badRequest(res, 'Missing required fields');
        }

        const component = await Component.create({
            name,
            type,
            description,
            configuration,
            projectId,
            createdBy: req.user._id
        });

        responseHandler.success(res, 'Component created successfully', component);
    } catch (error) {
        responseHandler.error(res, 'Failed to create component', error);
    }
};

// Get all components
export const getAllComponents = async (req, res) => {
    try {
        const { projectId } = req.query;
        const filter = projectId ? { projectId } : {};

        const components = await Component.find(filter)
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        responseHandler.success(res, 'Components retrieved successfully', components);
    } catch (error) {
        responseHandler.error(res, 'Failed to retrieve components', error);
    }
};

// Get component by ID
export const getComponentById = async (req, res) => {
    try {
        const component = await Component.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!component) {
            return responseHandler.notFound(res, 'Component not found');
        }

        responseHandler.success(res, 'Component retrieved successfully', component);
    } catch (error) {
        responseHandler.error(res, 'Failed to retrieve component', error);
    }
};

// Update component
export const updateComponent = async (req, res) => {
    try {
        const { name, type, description, configuration, status, version } = req.body;

        const component = await Component.findById(req.params.id);

        if (!component) {
            return responseHandler.notFound(res, 'Component not found');
        }

        // Update fields
        component.name = name || component.name;
        component.type = type || component.type;
        component.description = description || component.description;
        component.configuration = configuration || component.configuration;
        component.status = status || component.status;
        component.version = version || component.version;

        const updatedComponent = await component.save();

        responseHandler.success(res, 'Component updated successfully', updatedComponent);
    } catch (error) {
        responseHandler.error(res, 'Failed to update component', error);
    }
};

// Delete component
export const deleteComponent = async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);

        if (!component) {
            return responseHandler.notFound(res, 'Component not found');
        }

        await component.deleteOne();

        responseHandler.success(res, 'Component deleted successfully');
    } catch (error) {
        responseHandler.error(res, 'Failed to delete component', error);
    }
};