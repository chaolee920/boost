const Subscribe = require('./subscribe.model');
const config = require('../../config');

exports.create = function(req, res) {

    if (!req.body.promo) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    const newSubscribe = new Subscribe({
        promo: req.body.promo,
        user: req.user._id,
        status: 0,
    });
    
    newSubscribe.save(function(err, data) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: data,
            });
        }
    });
}

exports.getSubscribes = function(req, res) {

    Subscribe.find({
        user: req.user._id,
        status: 0,
    }).populate('promo').populate('user', 'email firstName lastName roles').exec(function(err, subscribes) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: subscribes,
            });
        }
    });
}

exports.getUserSubscribesByPromo = function(req, res) {

    Subscribe.find({
        promo: req.params.id,
        status: 0,
    }).populate('promo').populate('user', 'email firstName lastName roles').exec(function(err, subscribes) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: subscribes,
            });
        }
    });
}

exports.delete = function(req, res) {

    Subscribe.find({ _id: req.params.id }, function(err, subscribes) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (subscribes.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            subscribes[0].status = -1;

            subscribes[0].save(function (err, result) {
                if (err) {
                    return res.json({
                        code: 500,
                        message: config.DB_ERROR,
                    });
                }
                res.json({
                    code: 200,
                    data: config.UPDATED,
                });
            });
        }
    });
}
