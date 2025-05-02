import User from "../models/user.model.js";
import createError from "../utils/customError.js";

// Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-__v");
        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
