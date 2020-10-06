const User = require('./user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.signup = function(req, res) {

    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    checkEmailDuplication(req, function(result) {
        if (result.status === 'error') {
            return res.json({
                code: 402,
                message: config.DB_ERROR,
            });
        } else if(result.status === 'duplicated'){
            return res.json({
                code: 403,
                message: config.EMAIL_DUPLICATION,
            });
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    passwordHash: hash,
                    email: req.body.email,
                    roles: req.body.roles
                });
                newUser.save(function(err, data) {
                    if (err) {
                        res.json({
                            code: 402,
                            message: config.DB_ERROR,
                        });
                    } else {
                        const userObj = {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            _id: data._id,
                            email: data.email,
                            roles: data.roles,
                            created: data.created,
                            updated: data.updated
                        };
                        const token = jwt.sign(userObj, config.JWT_SECRET, { 'expiresIn': '5h' });

                        res.json({
                            code: 200,
                            data: Object.assign(userObj, {
                                token,
                            }),
                        });
                    }
                })
            });
        });
    });
}

exports.login = function(req, res) {
    if(!req.body.email || !req.body.password) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    User.find({email: req.body.email}, function(err, users) {
        if (err){
            return res.json({
                code: 402,
                message: config.DB_ERROR,
            });
        }
        if (users.length == 0){
            return res.json({
                code: 401,
                message: config.AUTHENTICATION_FAILED,
            });
        }

        bcrypt.compare(req.body.password, users[0].passwordHash, function(err, isPasswordMatch) {
            if(isPasswordMatch == false) {
                return res.json({
                    code: 401,
                    message: config.AUTHENTICATION_FAILED,
                });
            }
            
            const userObj = {
                firstName: users[0].firstName,
                lastName: users[0].lastName,
                _id: users[0]._id,
                email: users[0].email,
                roles: users[0].roles,
                created: users[0].created,
                updated: users[0].updated
            };
            const token = jwt.sign(userObj, config.JWT_SECRET, { 'expiresIn': '5h' });
            res.json({
                code: 200,
                data: Object.assign(userObj, {
                    token,
                }),
            });
        });
        
    });
}

exports.getMe = function(req, res) {
    res.json({
        code: 200,
        data: req.user,
    });
}

function checkEmailDuplication(req, callback) {
    User.find({email: req.body.email}, function(err, users) {
        if (err) {
            callback({ status: 'error' });
        } else if (users && users.length > 0) {
            callback({ status: 'duplicated' });
        } else {
            callback({ status: 'ok' });
        }
    });
}
