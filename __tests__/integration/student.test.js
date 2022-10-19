const supertest = require('supertest');
const mongoose = require('mongoose'); // 导入mongoose 因为需要使用mongoose进行连接
const Student = require('../../src/models/student'); // mongo-client
const app = require('../../src/app');
const {generateToken} = require("../../src/utils/jwt");

const Token = generateToken({id: 'fake_id'});
// 在所有的request里面，都加上token -》helper function (createStudentRequest) -》对所有request统一增加token
//createStudentRequest 接受body，返回body+authorization（token）

const request = supertest(app);

const createStudentRequest = async (body) => {
    return request.post('/v1/students/')
        .send(body)
        .set('Authorization', `Bearer ${Token}`);
}

//每个测试都需要链接数据库，所以在开始的时候 连接数据库；测试结束的时候，断开链接
describe('v1/students', () => {
    // hooks -> life cycle method
    //异步；因为要连接数据库
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    describe('Create', () => {
        beforeEach(async () => {
            //在测试之前，把之前数据库内容清空，保证数据库的数据是这个测试用例添加的
            //每个测试都是独立存在的
            await Student.deleteMany({}).exec();
        });
        it('should save the student if request is valid', async () => {
            const validStudent = {
                firstName: 'xxx',
                lastName: 'yyy',
                email: 'xxx@gmail.com',
            };
            // 模拟发送post请求，得到response
            //const res = await request.post('/v1/students/').send(validStudent);
            const res = await createStudentRequest(validStudent);
            expect(res.statusCode).toBe(201);
            // 一种 验证 req。body是不是有上面三个student attribute;
            // 一种是去数据库查看是否添加了上面student
            const student = await Student.findOne(validStudent).exec(); // return value or null
            expect(student).toBeTruthy(); // Falsy value: 0 false undefined null
        });
        // 像这种只有小参数不对的情况下(firstname不符合要求 or email不符合要求)，要copy paste去测试各种i情况
        //jest提供了it.each``
        //这里是个表格，表头是field；对每一行提取出来做一个测试; firstname有最短长度限制；

        it.each`
        field           | value
        ${'firstName'}  | ${undefined}
        ${'email'}      | ${'abc'}
        ${'firstName'}  | ${'a'}
        `
        ('should return 400 when $field is $value', async ({field, value}) => {
            //先创建一个有效的对象；每次遍历测试用例的时候，把无效的field替换进去
            const validStudent = {
                firstName: 'xxx',
                lastName: 'yyy',
                email: 'xxx@gmail.com'
            };
            const invalidStudent = {
                ...validStudent,
                [field]: value, // field:value ->这样会新增加一个field作为key的值；如果要去field的值，需要[]
            };
            //const res = await request.post('/v1/students').send(invalidStudent);
            const res = await createStudentRequest(invalidStudent);
            expect(res.statusCode).toBe(400);
        })
    });
});