import express from 'express';
import { 
    followUser, 
    getUserProfile, 
    unfollowUser, 
    updateUserProfile 
} from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unfollowUser);

export default router;
