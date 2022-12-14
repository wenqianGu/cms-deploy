const mongoose = require('mongoose');
const logger = require('./logger');

function connectToDB(){
    const connectionString =  process.env.CONNECTION_STRING;
    if(!connectionString){
        // through Error() 
        logger.error('connection string not defined')
        //正常退出，
       //非正常退出
       //人为正常退出 process.exit(0)
       //人为非正常退出 process.exit(X) X非零 -
       process.exit(1);
    }
    //做检测，先获取到db对象
    const db = mongoose.connection;
    db.on('connected', ()=>{
        logger.info(`DB connected, ${connectionString}`)
    })
    db.on('error', (error) => {
        logger.error(error.message);
        process.exit(2);
    })
    
    db.on('disconnected', ()=>{
        //电脑休眠的时候，会出现这种记录
        logger.info('db connection lost')
    })
    return mongoose.connect(connectionString)
}

module.exports = connectToDB;