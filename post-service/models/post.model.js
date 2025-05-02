import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 500, // Limit the length of post content
        },
        image: {
            type: String,
            default: "", // Optional image URL
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Array of user IDs who liked the post
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User", // User who commented
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
