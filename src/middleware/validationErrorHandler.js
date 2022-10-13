const logger = require("../utils/logger");
//专门针对validation error 如果不是的话调用next 
module.exports = (error,req,res,next) => {
    if(error.name === 'ValidationError'){
        return res.status(400).json(error);
    }
    next(error);
}

// //自定义的error 
// //next(new CustomError(''))

// next(new CustomError(''));
// //自定义的error可以继承error
// class CustomError extends Error{

// }
// //如果error是自定义error的话，可以做一些逻辑处理
// if(error instanceof CustomError){

// }