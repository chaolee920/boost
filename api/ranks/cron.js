const async = require('async');
const CronJob = require('cron').CronJob;
const Rank = require('./rank.model');
const User = require('../users/user.model');
const Subscribe = require('../subscribes/subscribe.model');
const Sale = require('../sales/sale.model');
const config = require('../../config');

exports.start = function() {
	const job = new CronJob(
		'0 0 0 * * *',
		function() {
			const result = [];
			console.log('-- start --');
			async.waterfall([
				function(main_cb) {
					User.find({}, function(err, users) {
						if (err) {
							main_cb(config.DB_ERROR);
						} else {
							main_cb(null, users);
						}
					});
				},
				function(users, main_cb) {
					async.eachSeries(users, function (user, cb) {
						async.waterfall([
							function (sub_cb) {
								Subscribe.find({
									status: 0,
									user: user._id,
								}).populate('promo').exec(function(err, subscribes) {
									if (err) {
										sub_cb(config.DB_ERROR);
									} else {
										sub_cb(null, subscribes);
									}
								});
							},
							function (subscribes, sub_cb) {
								if (subscribes.length > 0) {
									Sale.find({
										subscription: subscribes.map(function (s) {
											return s._id;
										}),
										status: 0,
									}).exec(function(err, sales) {
										if (err) {
											sub_cb(config.DB_ERROR);
										} else {
											sub_cb(null, sales);
										}
									});
								} else {
									sub_cb(null, []);
								}
							}
						], function (err, sales) {
							if (err) {
								cb(err);
							} else {
								result.push({
									user: user._id,
									sold: sales.length,
									date: new Date(),
								});
								cb(null);
							}
						});
					}, function (err) {
						if (err) {
							main_cb(err);
						} else {
							main_cb();
						}
					});
				},
				function(main_cb) {
					result.sort(function (r1, r2) {
						if (r1.sold < r2.sold) {
							return 1;
						}
						if (r1.sold > r2.sold) {
							return -1;
						}
						return 0;
					});
					async.eachSeries(result, function (item, sub_cb) {
						const newRank = new Rank({
							...item,
							rank: result.indexOf(item) + 1,
						});

						newRank.save(function(err, data) {
							if (err) {
								sub_cb(config.DB_ERROR);
							} else {
								sub_cb();
							}
						});
					}, function (err) {
						if (err) {
							main_cb(err);
						} else {
							main_cb();
						}
					});
				}
			], function(err) {
				console.log('-- final --');
				if (err) {
					console.log(err);
				} else {
					console.log(JSON.stringify(result));
				}
			});
		},
		null,
		true,
	);
};
