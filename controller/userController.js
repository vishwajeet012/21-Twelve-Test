const Joi = require("joi");
require('dotenv').config();
const User = require('../Models/user');
const Book = require('../Models/book');
const bcrypt = require('bcryptjs');
const { registerSchema, loginSchema } = require('../Validators/libraryValidator');

// User registration
const registerUser = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken(); 
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

        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};


// View all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send(books);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

// View details of a single book
const getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }
        res.status(200).send(book);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

// Search books by title, author, or genre
const searchBooks = async (req, res) => {
    const { query } = req.query;
    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).send(books);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

// user borrow books
const borrowBooks = async (req, res) => {
    const { userId, bookIds } = req.body;

    try {
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const alreadyBorrowedBooks = await Book.find({ _id: { $in: bookIds }, borrowedBy: userId });
        if (alreadyBorrowedBooks.length > 0) {
            return res.status(400).send({ error: 'One or more books are already borrowed by this user' });
        }

        const booksToBorrow = await Book.find({ _id: { $in: bookIds } });
        if (booksToBorrow.length !== bookIds.length) {
            return res.status(404).send({ error: 'One or more books not found' });
        }

        const borrowedBookIds = booksToBorrow.map(book => book._id);
        await Book.updateMany(
            { _id: { $in: borrowedBookIds }, borrowedBy: { $exists: false } }, 
            { $set: { borrowedBy: userId } }
        );

        user.borrowedBooks.push(...borrowedBookIds);
        await user.save();

        res.status(200).send({ message: 'Books borrowed successfully', user });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};


const returnBooks = async (req, res) => {
    const { userId, bookIds } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.borrowedBooks = user.borrowedBooks.filter(bookId => !bookIds.includes(bookId.toString()));

        await user.save();

        res.status(200).send({ message: 'Books returned successfully', user });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

const getBorrowedBooks = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId).populate('borrowedBooks');

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send(user.borrowedBooks);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllBooks,
    getBookById,
    searchBooks,
    borrowBooks,
    returnBooks,
    getBorrowedBooks
};
