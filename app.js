const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./database/db'); 
const routes = require('./Routes/route');

const app = express();
const port = 3000;

// MiddleWare
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});