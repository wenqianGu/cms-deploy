const {validateToken} = require('../utils/jwt')

module.exports = (req, res, next) => {
    // token 是放在 Authorization 在header里面；格式是 :Bearer:{token}
    // 从header取authorization；
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
        return res.sendStatus(401);
    }
    // 检查authorization里面的第0个是不是Bearer，以及值是不是正确的token
    const tokenArray = authorizationHeader.split(' ');
    if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
        return res.sendStatus(401);
    }
    //把payload取出来，调用validateToken
    const payload = validateToken(tokenArray[1]);
    if (!payload) {
        return res.sendStatus(401);
    }
    req.user = payload;
    return next();
}