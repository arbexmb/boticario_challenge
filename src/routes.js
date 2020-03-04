const routes = require('express').Router();
const RetailerController = require('./modules/retailers/RetailerController');

routes.get('/retailers', RetailerController.index);

routes.post('/retailers', RetailerController.store);

module.exports = routes;
