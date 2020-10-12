const async = require('async');
const Restaurant = require('./restaurant.model.js');
const config = require('../../config');

exports.create = function(req, res) {

    if (!req.body.name) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    const newRestaurant = new Restaurant({
        name: req.body.name,
    });
    
    newRestaurant.save(function(err, data) {
        if (err) {
            res.json({
                code: 402,
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

exports.getRestaurants = function(req, res) {

    Restaurant.find({}).populate('creator', 'email firstName lastName roles').exec(function(err, restaurants) {
        if (err) {
            res.json({
                code: 402,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: restaurants,
            });
        }
    });
}

exports.getRestaurant = function(req, res) {

    Restaurant.find({ _id: req.params.id }).populate('event').exec(function(err, restaurants) {
        if (err) {
            res.json({
                code: 402,
                message: config.DB_ERROR,
            });
        } else if (restaurants.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            res.json({
                code: 200,
                data: restaurants[0],
            });
        }
    });
}

exports.update = function(req, res) {

    Restaurant.find({ _id: req.params.id }, function(err, restaurants) {
        if (err) {
            res.json({
                code: 402,
                message: config.DB_ERROR,
            });
        } else if (restaurants.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            restaurants[0] = Object.assign(restaurants[0], req.body);

            restaurants[0].save(function (err, result) {
                if (err) {
                    return res.json({
                        code: 402,
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

    Restaurant.find({ _id: req.params.id }, function(err, restaurants) {
        if (err) {
            res.json({
                code: 402,
                message: config.DB_ERROR,
            });
        } else if (restaurants.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            restaurants[0].remove(function (err, result) {
                if (err) {
                    return res.json({
                        code: 402,
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
