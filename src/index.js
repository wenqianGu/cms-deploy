require('dotenv').config();
const express = require('express');
require('express-async-errors');
const morgan = require('morgan')
const cors = require('cors');
const helmet = require('helmet');

const v1Router = require('./routes');
const logger = require('./utils/logger');
const connectToDB = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');
const validationErrorHandler = require('./middleware/validationErrorHandler');


const PORT = process.env.PORT || 3000; 

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors()) 



app.use('/v1',v1Router); //所有请求都转到v1Router里面
app.use(validationErrorHandler);
app.use(errorHandler);
connectToDB(); //在这里调用connectionDB 确保server开启 connection string加到环境变量里面

app.listen(PORT, () => {
    logger.info(`server listening at port ${PORT}`);
});

