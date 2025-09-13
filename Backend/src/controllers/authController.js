import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { responseHandler } from '../utils/responseHandler.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return responseHandler.badRequest(res, "Please provide all required fields");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return responseHandler.badRequest(res, "User already exists");
        }
        
        const user = await User.create({ name, email, password });
        responseHandler.success(res, "Registration successful", {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        responseHandler.error(res, "Registration failed", err);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return responseHandler.badRequest(res, "Please provide email and password");
        }

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            responseHandler.success(res, "Login successful", {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            responseHandler.unauthorized(res, "Invalid credentials");
        }
    } catch (err) {
        responseHandler.error(res, "Login failed", err);
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return responseHandler.notFound(res, "User not found");
        }
        responseHandler.success(res, "Profile retrieved successfully", user);
    } catch (err) {
        responseHandler.error(res, "Failed to get profile", err);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return responseHandler.notFound(res, "User not found");
        }

        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();
        responseHandler.success(res, "Profile updated successfully", {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (err) {
        responseHandler.error(res, "Failed to update profile", err);
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return responseHandler.badRequest(res, "Please provide current and new password");
        }

        const user = await User.findById(req.user._id);
        
        if (!user || !(await user.matchPassword(currentPassword))) {
            return responseHandler.unauthorized(res, "Current password is incorrect");
        }

        user.password = newPassword;
        await user.save();

        responseHandler.success(res, "Password changed successfully");
    } catch (err) {
        responseHandler.error(res, "Failed to change password", err);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return responseHandler.badRequest(res, "Please provide email");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return responseHandler.notFound(res, "No user found with this email");
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes

        await user.save();

        // In a real application, send this token via email
        responseHandler.success(res, "Password reset token generated", { resetToken });
    } catch (err) {
        responseHandler.error(res, "Failed to process forgot password request", err);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        if (!password || !token) {
            return responseHandler.badRequest(res, "Please provide password and token");
        }

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return responseHandler.badRequest(res, "Invalid or expired reset token");
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        responseHandler.success(res, "Password reset successful");
    } catch (err) {
        responseHandler.error(res, "Failed to reset password", err);
    }
};

const authController = { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    changePassword, 
    forgotPassword, 
    resetPassword 
};

export default authController;