require('dotenv').config();
const express = require('express');
require('express-async-errors');
const morgan = require('morgan')
const cors = require('cors');
const helmet = require('helmet');


const v1Router = require('./routes');

const errorHandler = require('./middleware/errorHandler');
const validationErrorHandler = require('./middleware/validationErrorHandler');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors()) 

app.use('/v1',v1Router); //所有请求都转到v1Router里面
app.use(validationErrorHandler);
app.use(errorHandler);

module.exports = app;


