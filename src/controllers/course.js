const Course = require('../models/course');
const Joi = require('joi');

//获取数据是从module获取的
async function getAllCourses(req, res) {

    const query = Course.find();
    if (process.env.NODE_ENV == 'production') {
        // 学习query可以串联，但是
        query.select('code name description');
    }
    const courses = await query.exec();
    return res.json(courses);
    // 接口请求，当firstName超出规定的长度之后，会有错误；但是目前没处理；
    // error 抓取到只，是个对象
    // method 1: course.find().exec().then(（res）=>{}).catch((err)=>{})
    // method 2: try{} catch(e){}
    // method 3: 
    // Course.find(error, result) => {
    //     if(error){
    //         return ...
    //     }
    //     // result handling
    //}

}

async function getCourseById(req, res) {
    const {id} = req.params;
    const course = await Course.findById(id).populate('students').exec();
    if (!course) {
        return res.status(404).json({error: "student not found"});
    }
    return res.json(course);
}

async function addCourse(req, res) {
    const {code, name, description} = req.body;
    const schema = Joi.object({
        name:Joi.string().min(2).max(10).required(),
        code:Joi.string().regex(/^[a-zA-Z]+[0-9]+$/).required(),
        //regux 开头结尾// ^ 以什么为开头 +[0-9]+$ ($前面是以XX为结尾)
        description: Joi.string()
    });
    // req.body不能直接传递给mongoose；因为mongoose有一些字段，不想外部可以访问到；
    // 此处定义的所有字段，是针对这个请求的；可以传递req.body传给这个schema，只会验证上面写的字段 name, code, description
    schema.validateAsync(req.body,{
        allowUnknown:true,
        stripUnknown:true
    })
    // if the course already exist,no further add action.
    const existingCourse = await Course.findById(code).exec();
    if(existingCourse){
        return res.status(409).json({error:'duplicate course code'});
    }
    const course = new Course({code, name, description});
    await course.save();
    return res.status(201).json(course);
}

async function updateCourseById(req, res) {
    const {id} = req.params;
    const {code, name, description} = req.body;
    //without {new: true} 会返回更新前的结果
    const course = await Course.findByIdAndUpdate(id, {name, description}, {new: true}).exec();
    if (!course) {
        return res.status(404).json({error: "student not found"});
    }
    return res.json(course);
}

async function deleteCourseById(req, res) {
    const {id} = req.params;
    const course = await Course.findByIdAndDelete(id).exec();
    if (!course) {
        return res.status(404).json({error: "student not found"});
    }
    return res.sendStatus(204);
}

module.exports = {
    getAllCourses,
    getCourseById,
    updateCourseById,
    addCourse,
    deleteCourseById
}
