const express = require('express');
const controller = require('./survey.controller');
const router = express.Router();
const authService = require('../auth.service');

router.post('/', authService.checkAuthentication, controller.create);
router.put('/:id', authService.checkAuthentication, controller.update);
router.delete('/:id', authService.checkAuthentication, controller.delete);
router.get('/by/creator', authService.checkAuthentication, controller.getSurveysByCreator);
router.get('/', authService.checkAuthentication, controller.getSurveys);

module.exports = router;
