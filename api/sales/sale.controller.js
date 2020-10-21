const async = require('async');
const Sale = require('./sale.model.js');
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

exports.getSales = function(req, res) {

    Sale.find({
        status: 0,
    }).populate('subscription').exec(function(err, sales) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: sales,
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
