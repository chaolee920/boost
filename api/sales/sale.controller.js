const async = require('async');
const Sale = require('./sale.model.js');
const Subscribe = require('../subscribes/subscribe.model.js');
const config = require('../../config');

exports.create = function(req, res) {

    if (!req.body.subscription || !req.body.date) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    const newSale = new Sale({
        subscription: req.body.subscription,
        date: req.body.date,
        status: 0,
    });
    
    newSale.save(function(err, data) {
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

exports.getSalesByUser = function(req, res) {
    async.waterfall([
        function(cb) {
            Subscribe.find({
                status: 0,
                user: req.params.id,
            }).populate('promo').exec(function(err, subscribes) {
                if (err) {
                    cb({
                        code: 500,
                        message: config.DB_ERROR,
                    });
                } else {
                    cb(null, subscribes);
                }
            });
        },
        function (subscribes, cb) {
            Sale.find({
                subscription: subscribes.map(function (s) {
                    return s._id;
                }),
                status: 0,
            }).populate('subscription').exec(function(err, sales) {
                if (err) {
                    cb({
                        code: 500,
                        message: config.DB_ERROR,
                    });
                } else {
                    cb(null, sales, subscribes);
                }
            });
        }
    ], function(err, sales, subscribes) {
        if (err) {
            res.json(err);
        } else {
            const result = subscribes.map(function (s) {
                return {
                    promo: s.promo,
                    sales: [],
                }
            });
            sales.forEach(function (sale) {
                const resultSale = result.find(function(r) {
                    return r.promo._id.toString() === sale.subscription.promo.toString();
                });
                if (resultSale) {
                    resultSale.sales.push({
                        _id: sale._id,
                        date: sale.date,
                        status: sale.status,
                        created: sale.created,
                        updated: sale.updated,
                    });
                }
            });
            res.json({
                code: 200,
                data: result,
            });
        }
    });
}

exports.getSalesByPromo = function(req, res) {
    async.waterfall([
        function(cb) {
            Subscribe.find({
                status: 0,
                promo: req.params.id,
            }).populate('user').exec(function(err, subscribes) {
                if (err) {
                    cb({
                        code: 500,
                        message: config.DB_ERROR,
                    });
                } else {
                    cb(null, subscribes);
                }
            });
        },
        function (subscribes, cb) {
            Sale.find({
                subscription: subscribes.map(function (s) {
                    return s._id;
                }),
                status: 0,
            }).populate('subscription').exec(function(err, sales) {
                if (err) {
                    cb({
                        code: 500,
                        message: config.DB_ERROR,
                    });
                } else {
                    cb(null, sales, subscribes);
                }
            });
        }
    ], function(err, sales, subscribes) {
        if (err) {
            res.json(err);
        } else {
            const result = subscribes.map(function (s) {
                return {
                    user: {
                        _id: s.user._id,
                        firstName: s.user.firstName,
                        lastName: s.user.lastName,
                        email: s.user.email,
                        roles: s.user.roles,
                    },
                    sales: [],
                }
            });
            sales.forEach(function (sale) {
                const resultSale = result.find(function(r) {
                    return r.user._id.toString() === sale.subscription.user.toString();
                });
                if (resultSale) {
                    resultSale.sales.push({
                        _id: sale._id,
                        date: sale.date,
                        status: sale.status,
                        created: sale.created,
                        updated: sale.updated,
                    });
                }
            });
            res.json({
                code: 200,
                data: result,
            });
        }
    });
}

exports.delete = function(req, res) {

    Sale.find({ _id: req.params.id }, function(err, sales) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (sales.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            sales[0].status = -1;

            sales[0].save(function (err, result) {
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
