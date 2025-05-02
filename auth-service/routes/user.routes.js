import express from 'express';
import { getUserProfile } from '../controllers/user.controllers.js';

const router = express.Router();


// Get User profile
router.get('/:id', getUserProfile)

export default router;