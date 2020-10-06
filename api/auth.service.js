const jwt = require('jsonwebtoken');
const config = require('../config');

exports.checkAuthentication = function(req, res, next) {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
			if (err) {
				res.json({
                    code: 401,
                    message: config.AUTHENTICATION_FAILED,
                });
			} else {
				delete decoded.iat;
				delete decoded.exp;
				req.user = decoded;
				next();
			}
		});
	} else {
		res.json({
			code: 401,
			message: config.AUTHENTICATION_FAILED,
		});
	}
}
