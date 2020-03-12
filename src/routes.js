const routes = require('express').Router();
const RetailerController = require('./modules/retailers/RetailerController');
const PurchaseController = require('./modules/purchases/PurchaseController');

// Retailers routes
routes.get('/retailers', RetailerController.index);
routes.post('/retailers', RetailerController.store);
routes.get('/retailers/purchases', RetailerController.purchases);
routes.post('/retailers/login', RetailerController.login);
routes.get('/retailers/logout', RetailerController.logout);
routes.get('/retailers/cashback', RetailerController.cashbackTotal);
routes.get('/retailers/cashback-api/:cpf', RetailerController.cashbackApi);
routes.get('/retailers/cashback/:cpf', RetailerController.cashbackTotalByCpf);
routes.get('/retailers/:cpf', RetailerController.findByCpf);

// Purchase routes
routes.post('/purchases', PurchaseController.store);
routes.get('/purchases/:cpf', PurchaseController.purchasesByRetailerCpf);
routes.post('/purchases/:cpf', PurchaseController.storeByRetailerCpf);

module.exports = routes;
