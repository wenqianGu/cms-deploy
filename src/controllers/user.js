const User = require('../models/user')
const {generateToken} = require("../utils/jwt");

async function register(req, res) {
    const {username, password} = req.body;
    //validation
    // check if username duplicate
    // and uniq index to username?
    const user = new User({username, password});
    // method1: 创建完user之后，保存之前；直接用bcrypt 加密
    // method: 在module里面 创建一个函数
    await user.hashPassword();
    await user.save();
    const token = await generateToken({username});
    return res.json({token});
}

async function login(req, res) {
    const {username, password} = req.body;
    const existingUser = await User.findOne({username}).exec();
    if (!existingUser) {
        return res.status(404).json({error: "invalid username or password"});
    }
    const isPasswordValid = await existingUser.validatePassword(password);
    if (!isPasswordValid) {
        return res.status(404).json({error: "invalid username or password"});
    }
    //这里应该返回一个token
    const token = await generateToken({username, role:existingUser.role});
    return res.json({token});
}


module.exports = {
    register,
    login,
};