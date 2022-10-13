module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * 允许所有的method
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
};