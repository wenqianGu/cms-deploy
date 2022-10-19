const app = require('./app');
const connectToDB = require("./utils/db");
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

connectToDB(); //在这里调用connectionDB 确保server开启 connection string加到环境变量里面

app.listen(PORT, () => {
    logger.info(`server listening at port ${PORT}`);
});
