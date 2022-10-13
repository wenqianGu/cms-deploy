# 数据库设计 
## ER Diagram 
    * collection 名字 属性 
    * reference 
    * 设计好的表，通过图形的形式表示出来；

## 练习
* students
* teachers
* courses 
## Connection string
* Domain, 数据库的名字 

## student and course 双边绑定的时候
1. Schema层的绑定，在Model里面 
2. 接口层面的，可以在controller ->student里面 添加 
```js
//负责把课程加到学生里面； 双边绑定
async function addStudentToCourse(req,res){
    const {id, code} = req.params;
    //检测学生id course code是否存在
    const course = await Course.findById(code).exec();
    let student = await Student.findById(id).exec();
    if(!student || !course){
        return res.status(404).json({error:"student or course not found"});
    }
    // 找到学生，把course添加进去
    student = await Student.findByIdAndUpdate(
        id,
        {courses:{$push:code}},
        {new:true}
    ).exec();
    //找到课程，把学生加进去
    course.students.addToSet(id);
    await course.save();
    
    return res.json(student);
}
```
* 问题是：维护course相关的逻辑的时候，需要到student/controller去维护 

3. 也可以抽离到service层级，分别在student course里面添加 
    - 所有和这个resources相关的都放在当前资源下，
    - 检测学生是否存在，应该在student、service里面
    - 检测course是否存在，应该在service - course里面 
    - 如果有service层的话，可能会合并 controller and router ; 因为controller只是从params取数据，有些多余；逻辑都在service层面处理
```js
// 需要ts injection等
class CourseService{
    addStudentToCourse(){

    }
}
```
    - 简单的service
```js
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
```

### 怎么删除课程和学生的关联(controller)
### 删除课程的时候，学生那边关联的课程reference 如何处理？
* 删除resources之前，确保关联删除干净~

## middleware 实现，对所有middleware function都做一层判断
* 对每个route handler都做try and catch 的处理
* 把 tryCatch写成单独的函数 
- 在controller > student.js里面 
```js
// curring function 
// high order function 高阶函数；前端比较常见； 
//得到的一个参数，是一个函数，传入的函数有很多自己复杂逻辑； 
function tryCatch(routeHandler){
    //对所有的route handler都做try catch处理，
    //问题：req res 从哪里来？
    return async (req,res,next) =>{
        try{
            await routeHandler(req,res,next);
         } catch(e) {
             res.json(e);
             //next(e);
         }
    }   
}
```
- 在routes > student.js里面
- 可以在route handler外面包裹tryCatch;这样就不需要在每个页面外面去做 try catch啦

```js
const express = require('express');
const {getAllStudents, getStudentById, updateStudentById,deleteStudentById,addStudent, addStudentToCourse, removeStudentFromCourse,tryCatch } = require('../controllers/student')

const studentRouter =  express.Router();

studentRouter.get('', getAllStudents);
studentRouter.get('/:id',getStudentById);
studentRouter.put('/:id',updateStudentById);
studentRouter.delete('/:id', deleteStudentById);
studentRouter.post('',tryCatch(addStudent)); // 不需要每个controller 函数里面做try catch判断 
studentRouter.post('/:id/courses/:code', addStudentToCourse);
studentRouter.delete('/:id/courses/:code', removeStudentFromCourse);
module.exports = studentRouter;
```

## package -> express async errors library
* try catch注入到了express的框架里面； 需要对express的代码进行相应的改变 
* https://www.npmjs.com/package/express-async-errors

## error handler
* 可以像route一样做一个index.js 

* 自定义错误类型
```js
//自定义的error 
//next(new CustomError(''))

next(new CustomError(''));
//自定义的error可以继承error
class CustomError extends Error{

}
//如果error是自定义error的话，可以做一些逻辑处理
if(error instanceof CustomError){

}
```

## Validation 
- 在schema里面做validate 
- Mongoose的验证，只有在save的时候才做验证； 比如 findByIdAndUpdate ->是不做数据的validate的 
- 下面例子是在Mongoose里面做的数据验证 
```js
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

```
* 后端永远都要做数据验证 
    - 尽管前端做了邮件验证，但是永远不要相信请求发过来的数据
    - 黑客通过postman发送模拟请求，数据不安全 
    - 不要相信前端（接口）发送过来的任何数据
* 在Mongoose外部，创建document之前做好数据验证 
    - courseCode验证 
    - 取到body里面的数据之后，是要做数据验证的；

# API Authentication & Authorization 
* Authentication: Refers to verify who you are, so you need to use username and password to authentication.
* Authorization: Refers to what you can do, for example access, edit or delete permissions to some documents and this happens after verification passes. 
## JWT
    - JSON Web Token are an open, industry standard RFC 7519 method for respresenting claims security 
* 怎么保证token不被篡改？ 
* 核心逻辑 signature 
    - jwt.io 
    - 三部分； 前面两部分是BASE64 编码的，
      - Header  : 头部信息
      - PAYLOAD : 数据信息， 明文存在，任何人都可以读取到；
      - Verify Signature 
```JS
HMASCHA256(
    base64UrlEncode(header) +"."+
    base64UrlEncode(payload),
    your-256-bit-secret
)
```
    - 角色（role based）和(operational based) 操作权限，决定用户可以访问什么数据；
## 加密 解密
1. 加密，解密，哈希
   * encrypt, decrypt, hash
   * x ->X x通过算法加密成X
   * X ->x 通过算法把X解密成x
2. 密码password加密
  * x -> Y 把X变成Y之后，没办法在解密逆转得到X； 密码是没办法通过解密逆转成之前的值
  - 对比hash之后的值；
  - 用户输入密码之后，通过hash得到Y，对比Y和数据库存储的Y是否相同；相同的话就是密码正确，否则密码错误；
  - hash是加密的一种；
3. 实际的密码管理操作
    - 用统一的算法，管理1w用户名和密码； 
      - dictionary attack 
        - 黑客 用常用的密码进行hash计算；比如football，比对数据库1w条记录；最后匹配的密码就是football 
      - 暴力破解
        - aaa->bbb 因为只用一个算法加密，也能暴力破解出密码
4. salt 
   - 比如football是一个用户的密码，数据库存 hash之后的xxxx； 这样可以推断其他用户的密码 （包括football）
   - 同样的密码，通过hash之后，得到不同的hash之后的字符串 
     - football -salt1 -> xxxx1salt1
     - football - salt2 -> xxxx2salt2 
     - salt要明文存储，只有知道用的那个salt加密的，自己服务器才可以做密码验证
   - 现在大概加到10-12轮 salt
5. bcrypt
   - bcrypt 
   - 在server端做的；
```js
const bcrypt = require('bcrypt');

const password = '123';


//const salt = bcrypt.genSaltSync(12);
const salt = '$2b$12$waJvtevVmLyeDHQoD2BGUe';
//console.log(salt);
const result = bcrypt.hashSync(password, salt); // 也可以把盐传给这个函数
console.log(result);
//salt是最终明文存储在hash之后的密码中的；
// $2b$12$waJvtevVmLyeDHQoD2BGUe
// $2b$12$waJvtevVmLyeDHQoD2BGUe-----Y9B/mym4DCRGYeRr8jjBAXoZiuRaVk2; 生成的密码是salt+hash之后的密码
// 用户输入密码之后，数据库取出来上面hash的记录；
// 然后 拿到salt + 用户输入的密码 -》用户hash 计算得到密码；

// 随机加salt
// 加盐之后，同样的密码生成的结果会完全不同；
//$2b$12$LHYBnqKEgOaRKXbPL7ob1OyCCh2WUCGObDZuTqJszAQuWHZ.gaFOS
//$2b$12$nGCkvTjpmBuznvvJg76DCu7lm1iljRsG7ar5aff4Ukmje1ceGMu2O
```
6. 实际项目中，如何使用加密算法 
    * method 1： 在controller -user.js里面，创建user之后，保存之前
    * method 2： 把这块加密逻辑抽离出来
    * method 3： monogoose自己的一些方法 -》 models -> user.js

### Login
* post 请求 
* JWT token 生成的必要条件
  - npm i jsonwebtoken
  - payload 
  - secret 
* 非必要的 token过期
  - ？ 为什么需要过期
  - access token -> 不过期的，用户可以一直用这个token操作所有事情 
  - refresh token -> 根据refresh token 再次生成一个access token，用户没有感知的情况下
    - refresh 有没有过期的逻辑？ 存在哪里？ 
    - 需要把refresh token同时存在数据库 
    - 类似于之前的session 和 cookie的概念 
* 怎么签发JWT token，怎么设置过期 
    - 
* 签发完token之后，验证token以及相应的操作权限 
    - 用户请求resource的时候
      - 是否携带token，要验证 token是否有效 -》 检查步骤放middleware里面
      - 在任何一个需要检查用户权限的请求，注入middleware 
      - authGuard.js 

###TO-do
* 注册账号 
  * https://portal.aws.amazon.com/billing/signup#/account
  * https://www.mongodb.com/atlas/database 

## authorization 
* 禁用token？ -》一般禁用 access token 
* JWT token签发之后，无状态的，token只要存在就一直有权限进行访问的；

# role based / attributed based (operation)
* 在model里面增加role
* 在user controller 的login里面 token 生成的时候，增加role； 
  * token 的payload里面有 role:admin 
* 针对每一个role，有个权限管理 adminGuard.js / middleware
  * 检查这个用户是不是有admin的权限；
* 控制学生，只有admin才能添加 
