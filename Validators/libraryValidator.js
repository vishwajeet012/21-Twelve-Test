const Joi = require('joi');

// User validation schema
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').required()
});

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

// Book validation schema
const bookSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    author: Joi.string().min(1).max(100).required(),
    genre: Joi.string().min(1).max(50).required(),
    publishedDate: Joi.date().iso().required(),
    ISBN: Joi.string().min(10).max(13).required()
});

module.exports = {
    registerSchema,
    loginSchema,
    bookSchema
};