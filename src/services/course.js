const Course = require('../models/course');

async function addStudentToCourse(studentId, courseId){
    const course = await Course.findByIdAndUpdate(courseId,{
        student:{$push: studentId}},
         {new: true}
    );
    if(!course){
        throw new Error('course not found');
    }
    return course;
}

module.export = {
    addStudentToCourse,
}