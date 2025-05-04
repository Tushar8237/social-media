import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { addComment, deleteComment, editComment, getComments } from "../controllers/comments.controllers.js";

const router = express.Router();

// Add comment
router.post('/comment/:id', verifyToken, addComment)

// Get all comments
router.get('/comments/:id', verifyToken, getComments)

//  Edit comment
router.put('/comment/update/:id', verifyToken, editComment);

// Delete comment
router.delete('/comment/delete/:id', verifyToken, deleteComment);




export default router; 