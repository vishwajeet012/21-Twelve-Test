const Joi = require("joi");
require('dotenv').config();
const bookModel = require('../Models/book')
const {bookSchema}  = require('../Validators/libraryValidator');

// Add a new book (Admin only)
const addBook = async (req, res) => {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { title, author, genre, publishedDate, ISBN } = req.body;

    try {
        const book = new bookModel({
            title,
            author,
            genre,
            publishedDate,
            ISBN
        });

        await book.save();
        res.status(201).send(book);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
};

// Update book details (Admin only)
const updateBook = async (req, res) => {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'author', 'genre', 'publishedDate', 'ISBN'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const book = await bookModel.findById(req.params.id);

        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        updates.forEach((update) => (book[update] = req.body[update]));
        await book.save();
        res.send(book);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
};

// Delete a book (Admin only)
const deleteBook = async (req, res) => {
            const del = "book deleted"
    try {
        const book = await bookModel.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        res.send(del);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

module.exports = { 
    addBook, 
    updateBook, 
    deleteBook
 };
