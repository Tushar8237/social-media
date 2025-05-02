import express from "express";
import {
    createPost,
    deletePost,
    getAllPost,
    getPost,
    updatePost,
} from "../controllers/post.controllers.js";

const router = express.Router();

//  Create a new post
router.post("/", createPost);

// Get a single post
router.get("/:id", getPost);

// Get all post
router.get("/", getAllPost);

// Update a post
router.put("/:id", updatePost);

// Delete a post
router.delete("/:id", deletePost);

export default router;
