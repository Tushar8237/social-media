import createError from "../utils/customError";
import User from "./../models/user.model";

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
        const { id: targetUserId } = req.params;
        const currentUserId = req.body.currentUserId;

        if (targetUserId === currentUserId) {
            return next(createError(400, "You can't follow yourself"));
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return next(createError(400, "User not found"));
        }

        targetUser.followers.push(currentUserId);
        currentUser.following.push(targetUserId);

        await targetUser.save();
        await currentUser.save();

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
        const { id: targetUserId } = req.params;
        const currentUserId = req.body.currentUserId;

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser)
            return next(createError(404, "User not found"));

        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== currentUserId
        );
        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== targetUserId
        );

        await targetUser.save();
        await currentUser.save();

        res.status(200).json({ success: true, message: "User unfollowed" });
    } catch (err) {
        next(err);
    }
};
