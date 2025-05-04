
import Post from '../models/post.model.js';
import createError from '../utils/customError.js';

// Like and unlike post
export const likeToggle = async (req, res, next) =>{
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if(!post) {
            return next(createError(404, 'Post not found'));
        }

        const liked = post.likes.includes(userId);

        if (liked) {
            // Unlike
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        } else {
            // Like
            post.likes.push(userId)
        }

        await post.save()

        console.log(post.likes)

        res.status(200).json({
            success : true,
            message : liked ? "Post unlike" : "Post liked",
            totalLikes : post.likes.length
        })
    } catch (error) {
        next(error)
    }
}