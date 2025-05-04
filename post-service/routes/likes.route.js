import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { likeToggle } from "../controllers/like.controllers.js";

const router = express.Router();

// Like unlike Post
router.put('/:id/like', verifyToken, likeToggle)

export default router; 