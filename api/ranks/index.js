const express = require('express');
const controller = require('./rank.controller');
const router = express.Router();
const authService = require('../auth.service');

router.post('/', authService.checkAuthentication, controller.create);
router.delete('/:id', authService.checkAuthentication, controller.delete);
router.get('/', authService.checkAuthentication, controller.getRankByDay);
router.get('/:id/month', authService.checkAuthentication, controller.getRanksByUserByMonth);

module.exports = router;
