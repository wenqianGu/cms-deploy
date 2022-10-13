const jwt = require('jsonwebtoken');

const {JWT_KEY} = process.env; // 不同的环境生成不同的值，避免泄露，只有机器知道这个值

function generateToken(payload) {
    return jwt.sign(payload, JWT_KEY, {expiresIn: '1h'});
}

function validateToken(token) {
    //return jwt.verify(token, JWT_KEY); 会返回 payload
    try{
        return jwt.verify(token, JWT_KEY); //只要发现token过期或者无效，就会抛出错误；
        // 可以在其他调用validateToken的地方做try catch
        // methods 2: 直接在当前函数，直接做try catch
    } catch (e){
        return null;
    }
}

module.exports = {
    generateToken,
    validateToken,
};