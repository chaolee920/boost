const Promo = require('./promo.model');
const config = require('../../config');

exports.create = function(req, res) {

    if (!req.body.name ||
        !req.body.type ||
        !req.body.startDate ||
        !req.body.endDate
    ) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    const newPromo = new Promo({
        name: req.body.name,
        type: req.body.type,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        image: req.body.image || '',
        description: req.body.description || '',
        creator: req.user._id,
    });
    
    newPromo.save(function(err, data) {
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

exports.getPromos = function(req, res) {

    Promo.find({}).populate('restaurant').populate('creator', 'email firstName lastName roles').exec(function(err, promos) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: promos,
            });
        }
    });
}

exports.getPromo = function(req, res) {

    Promo.find({ _id: req.params.id }).populate('restaurant').populate('creator', 'email firstName lastName roles').exec(function(err, promos) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (promos.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            res.json({
                code: 200,
                data: promos[0],
            });
        }
    });
}

exports.update = function(req, res) {

    Promo.find({ _id: req.params.id }, function(err, promos) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (promos.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            promos[0] = Object.assign(promos[0], req.body);

            promos[0].save(function (err, result) {
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

exports.delete = function(req, res) {

    Promo.find({ _id: req.params.id }, function(err, promos) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (promos.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            promos[0].remove(function (err, result) {
                if (err) {
                    return res.json({
                        code: 500,
                        message: config.DB_ERROR,
                    });
                }
                res.json({
                    code: 200,
                    data: config.REMOVED,
                });
            });
        }
    });
}
