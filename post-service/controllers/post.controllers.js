import Post from "../models/post.model.js";
import createError from "../utils/customError.js";
import axios from 'axios'

// Create post
export const createPost = async (req, res, next) => {
    try {
        const { content, image } = req.body;
        const userId = req.user.id;

        const newPost = new Post({
            user: userId,
            content,
            image,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            post: newPost,
        });
    } catch (error) {
        next(error);
    }
};

// Get a post by ID
// export const getPost = async (req, res, next) => { 
//     try {
//         const postId = req.params.id;
//         const post = await Post.findById(postId)
//             .populate("user", "username profilePic") // Populate user details
//             .populate("likes", "username") // Populate liked users
//             .populate("comments.user", "username profilePic") // Populate comment user details

//         if (!post) {
//             return next(createError(404, "Post not found"));
//         }

//         res.status(200).json({
//             success: true,
//             post,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
export const getPost = async (req, res, next) => { 
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
            .populate("likes", "username") // Populate liked users
            .populate("comments.user", "username profilePic") // Populate comment user details

        if (!post) {
            return next(createError(404, "Post not found"));
        }

        // Fetch user data from user service
        let userInfo = null

        try {
            const userRes = await axios.get(`http://localhost:5001/api/users/${post.user}`)
            userInfo = userRes.data.user

            // Remove sensitive data
             if (userInfo && userInfo.password) {
                delete userInfo.password;
            }
        } catch (error) {
            next(createError(401, "Failed to fetch user from user-service:"))
        }
        
        // Manually inject user info
        const populatePost = {
            ...post.toObject,
            user: userInfo
        }

        res.status(200).json({
            success: true,
            post : populatePost
        });
    } catch (error) {
        next(error);
    }
};

// Get all posts
// export const getAllPost = async (req, res, next) => {
//     try {
//         const posts = await Post.find()
//             .populate("user", "username profilePic")
//             .populate("likes", "username")
//             .populate("comments.user", "username profilePic")
//             .sort({ createdAt: -1 }); // Sort posts by newest first

//         res.status(200).json({ success: true, posts });
//     } catch (error) {
//         next(error);
//     }
// };
export const getAllPost = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate("likes", "username")
            .populate("comments.user", "username profilePic")
            .sort({ createdAt: -1 });

        // Fetch user data for each post from user-service
        const populatedPosts = await Promise.all(
            posts.map(async (post) => {
                let userInfo = null;

                try {
                    const userRes = await axios.get(`http://localhost:5001/api/users/${post.user}`);
                    userInfo = userRes.data.user;
                    if (userInfo?.password) delete userInfo.password;
                } catch (error) {
                    console.error(`Failed to fetch user ${post.user}:`, error.message);
                }

                return {
                    ...post.toObject(),
                    user: userInfo,
                };
            })
        );

        res.status(200).json({ success: true, posts: populatedPosts });
    } catch (error) {
        next(error);
    }
};


// Update a post for content or image change
export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { content, image } = req.body;

        // Find post in database
        const post = await Post.findById(postId);

        if (!post) {
            return next(createError(404, 'Post not found'));
        }

        post.content = content || post.content;
        post.image = image || post.image;

        await post.save()

        res.status(200).json({ success: true, post });
    } catch (error) {
        next(error)
    }
};


// Delete a post
export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id

        const post = await Post.findById(postId)

        // If no post through new error
        if (!post) {
            return next(createError(404, 'Post not found'));
        }

        await post.deleteOne()

        res.status(200).json({
            success : true,
            message : 'Post Deleted'
        })
    } catch (error) {
        next(error)
    }
}
