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