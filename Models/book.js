const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    ISBN: { type: String, required: true, unique: true },
});

const book = mongoose.model("Book", bookSchema);

module.exports =  book