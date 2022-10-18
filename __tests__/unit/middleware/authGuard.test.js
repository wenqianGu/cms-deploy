const authGuard = require('../../../src/middleware/authGuard');
//1. 先把需要mock的文件导入 2. 告诉jest去mock上面的文件
const {validateToken} = require('../../../src/utils/jwt');
jest.mock('../../../src/utils/jwt')

describe('authentication guard middleware', () => {
    it('should return 401 if authorization header is missing', () => {
        // jest.fn()类似于普通函数，增加了各种监控
        // function foo()
        //mock
        const req = {header: jest.fn()};
        const res = {sendStatus: jest.fn()};
        const next = jest.fn();

        authGuard(req, res, next);
        //如果
        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    //  token test -》 返回payload
    //尽量每个测试用例，只测一种情况
    it('should call next when token is valid', () => {
        const token = 'xxxxxxx';
        const req = {header: jest.fn().mockReturnValue(`Bearer ${token}`)};
        const res = {sendStatus: jest.fn()};
        const next = jest.fn();
        const payload = {};
        validateToken.mockImplementation((token) => {
            return payload;
        })
        authGuard(req,res,next);
        //expect(validateToken).toHaveBeenCalledWith(token); 尽量放在一个单独测试里，payload不为null的时候
        expect(req.user).toEqual(payload);
        expect(next).toHaveBeenCalled();
    });

    //省略三个测试
    // 长度不对(tokenArray.length)；关键字不对(Bearer)；token不对 (payload != req.user)；
    //规则是找edge case
})