import jwt from 'jsonwebtoken';

const jsonwebtoken = (userId) => {
    return jwt.sign({ id : userId._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

export default jsonwebtoken;
