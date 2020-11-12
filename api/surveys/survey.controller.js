const Survey = require('./survey.model');
const config = require('../../config');

exports.create = function(req, res) {

    if (!req.body.title || !req.body.description || !req.body.users || req.body.users.length === 0) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    const newSurvey = new Survey({
        title: req.body.title,
        creator: req.user._id,
        description: req.body.description,
        image: req.body.image || '',
        users: req.body.users || [],
        status: 0,
    });
    
    newSurvey.save(function(err, data) {
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

exports.getSurveysByCreator = function(req, res) {

    Survey.find({
        status: 0,
        creator: req.user._id,
    }).populate('creator', 'email firstName lastName roles, image').exec(function(err, surveys) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: surveys,
            });
        }
    });
}

exports.getSurveys = function(req, res) {

    Survey.find({
        status: 0,
        users: req.user._id,
    }).populate('creator', 'email firstName lastName roles, image').exec(function(err, surveys) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: surveys,
            });
        }
    });
}

exports.update = function(req, res) {

    Survey.find({ _id: req.params.id }, function(err, surveys) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (surveys.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            surveys[0] = Object.assign(surveys[0], req.body);

            surveys[0].save(function (err, result) {
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

    Survey.find({ _id: req.params.id }, function(err, surveys) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (surveys.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            surveys[0].status = -1;

            surveys[0].save(function (err, result) {
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
