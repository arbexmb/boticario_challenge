const Purchase = require('./Purchase');
const Retailer = require('../retailers/Retailer');

class PurchaseController {
  async store(req, res) {
    const response = await Purchase.create({
      value: req.body['value']
    }, (err, purchase) => {
      if(err) {
        return res.send({ error: err.message });
      }

      const retailer = Retailer.findById(req.body['retailer'], (err, retailer) => {
        retailer.purchases.push(purchase);
        retailer.save();

        res.status(201).json({ success: 'Created' });
      });
    });
  }
}

module.exports = new PurchaseController();
