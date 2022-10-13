const logger = require("../utils/logger");

module.exports = (error,req,res,next) => {
    //最后，抓取最后没有见到过的error的function 
    logger.error(error);
    return res
    .status(500)
    .json({error: 'something unexpected happened, please try again later'});
}