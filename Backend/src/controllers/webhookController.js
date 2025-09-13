import Webhook from '../models/Webhook.js';
import { responseHandler } from '../utils/responseHandler.js';
import axios from 'axios';

// Register a new webhook
export const registerWebhook = async (req, res) => {
    try {
        const {
            name,
            url,
            description,
            events,
            headers,
            method,
            projectId,
            retryConfig
        } = req.body;

        if (!name || !url || !events || !projectId) {
            return responseHandler.badRequest(res, 'Missing required fields');
        }

        const webhook = await Webhook.create({
            name,
            url,
            description,
            events,
            headers: headers || {},
            method: method || 'POST',
            projectId,
            retryConfig: retryConfig || {},
            createdBy: req.user._id
        });

        responseHandler.success(res, 'Webhook registered successfully', webhook);
    } catch (error) {
        responseHandler.error(res, 'Failed to register webhook', error);
    }
};

// List all webhooks for a project
export const listWebhooks = async (req, res) => {
    try {
        const { projectId } = req.query;
        const filter = projectId ? { projectId } : {};

        const webhooks = await Webhook.find(filter)
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        responseHandler.success(res, 'Webhooks retrieved successfully', webhooks);
    } catch (error) {
        responseHandler.error(res, 'Failed to retrieve webhooks', error);
    }
};

// Update webhook
export const updateWebhook = async (req, res) => {
    try {
        const {
            name,
            url,
            description,
            events,
            headers,
            method,
            isActive,
            retryConfig
        } = req.body;

        const webhook = await Webhook.findById(req.params.id);

        if (!webhook) {
            return responseHandler.notFound(res, 'Webhook not found');
        }

        // Update fields
        webhook.name = name || webhook.name;
        webhook.url = url || webhook.url;
        webhook.description = description || webhook.description;
        webhook.events = events || webhook.events;
        webhook.headers = headers || webhook.headers;
        webhook.method = method || webhook.method;
        webhook.isActive = isActive !== undefined ? isActive : webhook.isActive;
        webhook.retryConfig = retryConfig || webhook.retryConfig;

        const updatedWebhook = await webhook.save();

        responseHandler.success(res, 'Webhook updated successfully', updatedWebhook);
    } catch (error) {
        responseHandler.error(res, 'Failed to update webhook', error);
    }
};

// Delete webhook
export const deleteWebhook = async (req, res) => {
    try {
        const webhook = await Webhook.findById(req.params.id);

        if (!webhook) {
            return responseHandler.notFound(res, 'Webhook not found');
        }

        await webhook.deleteOne();

        responseHandler.success(res, 'Webhook deleted successfully');
    } catch (error) {
        responseHandler.error(res, 'Failed to delete webhook', error);
    }
};

// Test webhook
export const testWebhook = async (req, res) => {
    try {
        const webhook = await Webhook.findById(req.params.id);

        if (!webhook) {
            return responseHandler.notFound(res, 'Webhook not found');
        }

        const testPayload = {
            event: 'test',
            timestamp: new Date(),
            data: {
                message: 'This is a test webhook payload'
            }
        };

        try {
            const response = await axios({
                method: webhook.method,
                url: webhook.url,
                headers: Object.fromEntries(webhook.headers),
                data: testPayload
            });

            // Update last status
            webhook.lastStatus = {
                success: true,
                statusCode: response.status,
                message: 'Test successful',
                timestamp: new Date()
            };
            await webhook.save();

            responseHandler.success(res, 'Webhook test successful', {
                statusCode: response.status,
                data: response.data
            });
        } catch (error) {
            // Update last status
            webhook.lastStatus = {
                success: false,
                statusCode: error.response?.status,
                message: error.message,
                timestamp: new Date()
            };
            await webhook.save();

            responseHandler.error(res, 'Webhook test failed', {
                statusCode: error.response?.status,
                message: error.message
            });
        }
    } catch (error) {
        responseHandler.error(res, 'Failed to test webhook', error);
    }
};

// Utility function to send webhook (can be used internally)
export const sendWebhook = async (webhook, event, payload) => {
    if (!webhook.isActive || !webhook.events.includes(event)) {
        return;
    }

    const sendRequest = async (retryCount = 0) => {
        try {
            const response = await axios({
                method: webhook.method,
                url: webhook.url,
                headers: Object.fromEntries(webhook.headers),
                data: {
                    event,
                    timestamp: new Date(),
                    data: payload
                }
            });

            // Update last status
            webhook.lastStatus = {
                success: true,
                statusCode: response.status,
                message: 'Webhook sent successfully',
                timestamp: new Date()
            };
            await webhook.save();

            return true;
        } catch (error) {
            if (retryCount < webhook.retryConfig.maxRetries) {
                await new Promise(resolve => 
                    setTimeout(resolve, webhook.retryConfig.retryInterval)
                );
                return sendRequest(retryCount + 1);
            }

            // Update last status after all retries failed
            webhook.lastStatus = {
                success: false,
                statusCode: error.response?.status,
                message: error.message,
                timestamp: new Date()
            };
            await webhook.save();

            return false;
        }
    };

    return sendRequest();
};