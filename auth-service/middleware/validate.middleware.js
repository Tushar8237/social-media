


const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message.replace(/"/g, "'"),
        })
    }
    next();
}

export default validate;