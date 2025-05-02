import jwt from 'jsonwebtoken'
import createError from './../utils/customError.js';


const verifyToken = (req, res, next) => {
    const token = req.cookies?.access_token;
    
    if (!token) {
        return next(createError(401, 'Not authorized'))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next();
    } catch (error) {
        return next(createError(403, 'Invalid or expired token'))
    }
}

export default verifyToken