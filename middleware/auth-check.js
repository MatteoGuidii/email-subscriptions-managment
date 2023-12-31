const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    
    const token = authHeader.split(' ')[1]; // Authorization header looks like: "Bearer TOKEN"
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};

module.exports = authCheck;
