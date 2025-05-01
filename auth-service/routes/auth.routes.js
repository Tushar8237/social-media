import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controllers.js';
import validate from './../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const router = express.Router();

// Register user
router.post('/register', validate(registerSchema), registerUser)

// Login user
router.post('/login', validate(loginSchema), loginUser)

// Logout user
router.post('/logout', logoutUser)

export default router;

