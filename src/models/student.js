const {Schema, model} = require('mongoose');
const Joi = require('joi');
// student  firstName, lastName, email, courses (array-courseid) 
// 先创建基本的字段，关联关系先不考虑
//id不定义的话，默认使用mongoose的id； 如果声明的话，可以修改；改变类型等 
// firstName: String, 如果没有其他字段；可以简写，如果
const schema = new Schema ({
    firstName: {
        type: String,
        required: true,
        minlength:2,
        maxlength:10
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        validate:{
            validator:(email) =>{
                // regex
                // Joi
                // validator.js 
                // express-validator
                // const valudation = Joi.string().email().validate(email);
                // const {error} = valudation;
                // if(error){
                //     return false;
                // }
                // return true;
                //如果返回true 验证成功； error有值代表false，所有 ！
                return !Joi.string().email().validate(email).error;
            },
            msg:'Invalid email format',
        }
    },
    courses:[
        {
            type:String,
            ref:'Course'
        }
    ]
})

const Model = model('Student', schema);

module.exports = Model;