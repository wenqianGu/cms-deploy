const { Router } = require('express');
const { register,login } = require('../controllers/user')

const userRouter = Router();

userRouter.post('', register);
userRouter.post('/login', login);

module.exports = userRouter;