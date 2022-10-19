const express = require('express');
const {
    getAllStudents,
    getStudentById,
    updateStudentById,
    deleteStudentById,
    addStudent,
    addStudentToCourse,
    removeStudentFromCourse
} = require('../controllers/student')
//const adminGuard = require('../middleware/adminGuard');

const studentRouter = express.Router();

studentRouter.get('', getAllStudents);
studentRouter.get('/:id', getStudentById);
studentRouter.put('/:id', updateStudentById);
studentRouter.delete('/:id', deleteStudentById);
studentRouter.post('', addStudent); // 不需要每个controller 函数里面做try catch判断
studentRouter.post('/:id/courses/:code', addStudentToCourse);
studentRouter.delete('/:id/courses/:code', removeStudentFromCourse);
module.exports = studentRouter;