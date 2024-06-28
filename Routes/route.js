const express = require("express");
const Router = express.Router();
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const {authMiddleware, adminMiddleware} = require ('../middleWare/middleware')

//USER
Router.post('/User-Registration', userController.registerUser)
Router.post('/User-Login', userController.loginUser)

// Admin routes (protected)
Router.post('/add-books', authMiddleware, adminMiddleware, adminController.addBook);
Router.put('/books/:id', authMiddleware, adminMiddleware, adminController.updateBook);
Router.delete('/books/:id', authMiddleware, adminMiddleware, adminController.deleteBook);

module.exports = Router