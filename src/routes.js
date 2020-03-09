const routes = require('express').Router();
const RetailerController = require('./modules/retailers/RetailerController');
const PurchaseController = require('./modules/purchases/PurchaseController');

// Retailers routes
routes.get('/retailers', RetailerController.index);
routes.post('/retailers', RetailerController.store);
routes.get('/retailers/:id/purchases', RetailerController.purchases);
routes.post('/retailers/login', RetailerController.login);

// Purchase routes
routes.post('/purchases', PurchaseController.store);

module.exports = routes;
