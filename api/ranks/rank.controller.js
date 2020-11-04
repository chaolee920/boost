const async = require('async');
const Rank = require('./rank.model');
const config = require('../../config');

exports.create = function(req, res) {

    if (!req.body.user || !req.body.rank || !req.body.date || !(req.body.sold >= 0)) {
        return res.json({
            code: 400,
            message: config.MISSING_PARAMETER,
        });
    }

    const newRank = new Rank({
        user: req.body.user,
        rank: req.body.rank,
        date: req.body.date,
        sold: req.body.sold,
    });
    
    newRank.save(function(err, data) {
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

exports.getRankByDay = function(req, res) {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    
    Rank.find({
        date: { "$gte": date, "$lt": nextDate }
    }).sort('rank').populate('user', 'email firstName lastName roles, image').exec(function(err, ranks) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else {
            res.json({
                code: 200,
                data: ranks,
            });
        }
    });
}

exports.delete = function(req, res) {

    Rank.find({ _id: req.params.id }, function(err, ranks) {
        if (err) {
            res.json({
                code: 500,
                message: config.DB_ERROR,
            });
        } else if (ranks.length === 0) {
            res.json({
                code: 404,
                message: config.NOT_FOUND,
            });
        } else {
            ranks[0].remove(function (err, result) {
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
