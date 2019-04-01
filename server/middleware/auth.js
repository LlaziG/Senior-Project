const jwt = require('jsonwebtoken');
const config = require('config')

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token && !req.body.account) return res.status(401).send('Access denied. No token provided');
    else if(req.body.account) next();
    else{
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.user = decoded;
            next();
        }
        catch (ex) {
            res.status(400).send('Invalid token: ' + ex);
        }
    }
}

module.exports = auth;