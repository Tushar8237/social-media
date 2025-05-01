import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bio : Joi.string().min(3),
    profilePic : Joi.string(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
