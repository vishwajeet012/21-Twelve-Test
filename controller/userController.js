const Joi = require("joi");
require('dotenv').config();
const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const { registerSchema, loginSchema } = require('../Validators/libraryValidator');

// User registration
const registerUser = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken(); // Use generateAuthToken method
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
};

// User login
const loginUser = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const token = await user.generateAuthToken(); // Use generateAuthToken method
        res.send({ user, token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
