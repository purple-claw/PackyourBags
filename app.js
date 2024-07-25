const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

//Middleware Functions
app.use(morgan('dev'));
app.use(express.json()); //Middleware for req.body
app.use(express.static(`${__dirname}/public`)); //Middleware for Hosting Static Files.

//Route handlers
app.use('/api/v1/tours',tourRoutes);
app.use('/api/v1/users',userRoutes);

module.exports = app;
