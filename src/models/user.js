const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');


const schema = new Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
    }
});
// Mongoose的User model （object）
// hashPassword 存在哪里？ 存在于Mongoose的User object上面 -》什么是user object
//通过mongoose user model生成的object都有这个属性；
// controller -> user.js 可以直接调用user.hashPassword() 调用这个函数

schema.methods.hashPassword = async function () {
    this.password = await bcrypt.hash(this.password, 12);
// 用异步函数； 因为要用this 用普通函数 （not 箭头函数）
    // 需要这个this指向实际调用这个hash password 函数的对象 (object)
    //  因为这个对象上（object）， 是一个User object； 所以可以访问到这个hashPassword的属性；
    //然后把加密过的密码赋值回 this.password.
};

schema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const Model  = model('User', schema);
module.exports = Model;

/**
 * 加密，解密，哈希
 * encrypt, decrypt, hash
 *
 * x ->X x通过算法加密成X
 * X ->x 通过算法把X解密成x
 *
 * x -> Y 把X变成Y之后，没办法在解密逆转得到X； 密码是没办法通过解密逆转成之前的值
 *
 * 对比hash之后的值；
 * 用户输入密码之后，通过hash得到Y，对比Y和数据库存储的Y是否相同；相同的话就是密码正确，否则密码错误；
 * hash是加密的一种；
 * **/