const express = require("express");
const Router = express.Router();
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const {authMiddleware, adminMiddleware} = require ('../middleWare/middleware')

//USER
Router.post('/User-Registration', userController.registerUser)
Router.post('/User-Login', userController.loginUser)
Router.get('/User-viewbooks', userController.getAllBooks)
Router.get('/User-findBook/:id', userController.getBookById)
Router.get('/User-book-Search', userController.searchBooks)
Router.post('/User/books/borrowed',  userController.borrowBooks);
Router.post('/User-booksReturn',  userController.returnBooks);
Router.post('/User-books-borrowedList', userController.getBorrowedBooks);

// Admin routes (protected)
Router.post('/add-books', authMiddleware, adminMiddleware, adminController.addBook);
Router.put('/books/:id', authMiddleware, adminMiddleware, adminController.updateBook);
Router.delete('/books/:id', authMiddleware, adminMiddleware, adminController.deleteBook);

module.exports = Router