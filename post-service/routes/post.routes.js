import express from "express";
import {
    createPost,
    deletePost,
    getAllPost,
    getPost,
    updatePost,
} from "../controllers/post.controllers.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

//  Create a new post
router.post("/", verifyToken, createPost);

// Get a single post
router.get("/:id", verifyToken, getPost);

// Get all post
router.get("/", verifyToken, getAllPost);

// Update a post
router.put("/:id", verifyToken, updatePost);

// Delete a post
router.delete("/:id", verifyToken, deletePost);

export default router;
