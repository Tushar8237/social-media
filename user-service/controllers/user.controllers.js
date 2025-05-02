import createError from "../utils/customError.js";
import User from "./../models/user.model.js";
import mongoose from "mongoose";


// Temporary create user route
export const createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-__v");
        if (!user) {
            return next(createError(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        const updates = req.body;

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        }).select("-__v");

        if (!user) {
            return next(createError(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Follow User
export const followUser = async (req, res, next) => {
    try {

        // Get current user id and target usr id
        const { id: targetUserId } = req.params;
        const currentUserId = req.body.currentUserId;
        
        if (targetUserId === currentUserId) {
            return next(createError(400, "You can't follow yourself"));
        }
        
        // Cast error if current user id or target user id not found
        if (
            !mongoose.Types.ObjectId.isValid(targetUserId) ||
            !mongoose.Types.ObjectId.isValid(currentUserId)
        ) {
            return next(createError(400, "Invalid user ID(s)"));
        }

        // Find both user by id's
        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);


        if (!targetUser || !currentUser) {
            return next(createError(400, "User not found"));
        }

        // Check if the current user is already following the target user
        if (currentUser.following.includes(targetUserId)) {
            return next(createError(400, "You are already following this user"));
        }

        // Push user id's in respective place
        targetUser.followers.push(currentUserId);
        currentUser.following.push(targetUserId);


        // Save both user
        await targetUser.save();
        await currentUser.save();

        // Send response to the frontend
        res.status(200).json({
            success: true,
            message: "User followed",
        });
    } catch (error) {
        next(error);
    }
};

// Unfollow user
export const unfollowUser = async (req, res, next) => {
    try {
        // Get current user id and target usr id
        const { id: targetUserId } = req.params;
        const currentUserId = req.body.currentUserId;

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return next(createError(404, "User not found"));
        }

        // Remove user id from followers
        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== currentUserId
        );
        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== targetUserId
        );

        // Save both user
        await targetUser.save();
        await currentUser.save();

        // Send response to the frontend
        res.status(200).json({ 
            success: true, 
            message: "User unfollowed" 
        });
    } catch (err) {
        next(err);
    }
};
