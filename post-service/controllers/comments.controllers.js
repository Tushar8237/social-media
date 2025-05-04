import Post from '../models/post.model.js';
import createError from '../utils/customError.js';
import axios from 'axios'



// Create comments or add comments
export const addComment = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const { comment } = req.body

        // console.log(comment)

        if (!comment) {
            return next(createError(400, 'Comment is required'));
        }

        // Find post in db
        const post = await Post.findById(postId);

        if (!post) {
            return next(createError(404, 'Post not found'));
        }

        post.comments.push({
            user : userId,
            comment
        })

        await post.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comments: post.comments
        });
    } catch (error) {
        next(error)
    }
};


// Get comments populated
export const getComments = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate('comments.user', "username profilePic");

        if (!post) {
            return next(createError(404, 'Post not found'));
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
        
        res.status(200).json({
            success: true,
            user : userInfo,
            comments: post.comments
        });
    } catch (error) {
        next(error)
    }
} 


// Edit comment
// export const editComment = async (req, res, next) => {
//     try {
//         const { commentId, comment } = req.body;
//         const userId = req.user.id;


//         const post = await Post.findOne({"comments._id" : commentId})

//         if (!post) {
//             return next(createError(404, 'Post not found'));
//         }
        
//         const targetComment = post.comments.id(commentId);

//         if (!targetComment.user.equals(userId)) {
//             return next(createError(403, "You can only update your own comment"));
//         }

//         targetComment.comment = comment;

//         await post.save()

//         res.status(200).json({
//             success: true,
//             message: "Comment updated successfully",
//             updatedComment: targetComment
//         });

//     } catch (error) {
//         next(error)
//     }
// }
// PUT /api/posts/comments/:commentId

export const editComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const { comment } = req.body;
        const userId = req.user.id;

        const post = await Post.findOne({ "comments._id": commentId });

        if (!post) {
            return next(createError(404, 'Post not found'));
        }

        const targetComment = post.comments.id(commentId);

        if (!targetComment.user.equals(userId)) {
            return next(createError(403, "You can only update your own comment"));
        }

        targetComment.comment = comment;

        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            updatedComment: targetComment
        });
    } catch (error) {
        next(error);
    }
};



// Delete comment
// export const deleteComment = async (req, res, next) => {
//     try {
//         const commentId  = req.params.id;
//         const userId = req.user.id;
        
//         const post = await Post.findOneAndDelete({"comments._id" : commentId});
        
//         if (!post) {
//             return next(createError(404, 'Post not found'));
//         }

//         const targetComment = post.comments.id(commentId)

//         if (!targetComment.user.equals(userId)) {
//             return next(createError(403, "You can only update your own comment"));
//         }
        
//         await post.save()

//         res.status(201).json({
//             success: true,
//             message: "Comment delete successfully",
//         });

//     } catch (error) {
//         next(error)
//     }
// }
export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;


        // Just find the post
        const post = await Post.findOne({ "comments._id": commentId });


        if (!post) {
            return next(createError(404, 'Post not found'));
        }

        const targetComment = post.comments.id(commentId);

        if (!targetComment) {
            return next(createError(404, "Comment not found"));
        }

        if (!targetComment.user.equals(userId)) {
            return next(createError(403, "You can only delete your own comment"));
        }

        post.comments.pull(commentId); // Remove the comment
        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
