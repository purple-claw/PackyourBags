const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

//Middleware Functions
app.use(morgan('dev'));
app.use(express.json()); //Middleware for req.body
app.use(express.static(`${__dirname}/public`)); //Middleware for Hosting Static Files.

//Error Handling Middleware
const apperror = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Route handlers
app.use('/api/v1/tours',tourRoutes);
app.use('/api/v1/users',userRoutes);

app.all('*', (req,res,next) => {
    next(new apperror(`Cant FInd ${req.originalUrl} from the Routes`,404));
});

app.use(globalErrorHandler);

module.exports = app;
