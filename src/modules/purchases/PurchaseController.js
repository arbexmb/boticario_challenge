const Purchase = require('./Purchase');
const Retailer = require('../retailers/Retailer');
const { cpf } = require('cpf-cnpj-validator');

class PurchaseController {
  async store(req, res) {
    if(!req.session.retailer) {
      return res.status(401).send();
    }

    const cashback = cashbackByValue(req.body['value']);

    const response = await Purchase.create({
      status: 200,
      value: req.body['value'],
      cashback: {
        value: cashback.value,
        percentage: cashback.percentage
      }
    }, (err, purchase) => {
      if(err) {
        return res.send({ error: err.message });
      }

      const retailer = Retailer.findById(req.session.retailer[0]._id, (err, retailer) => {
        retailer.purchases.push(purchase);
        retailer.save();

        res.status(201).json({ success: 'Created' });
      });
    });
  }

  async storeByRetailerCpf(req, res) {
    const cpfParam = cpf.format(req.params['cpf']);
    if(!cpf.isValid(req.params['cpf'])) {
      return res.status(400).send({ error: 'Invalid CPF.' });
    }

    const retailer = Retailer.find({ cpf: cpfParam }, (err, retailer) => {
      if(err) {
        return res.send({ error: err.message });
      }

      if(retailer.length < 1) {
        return res.send({ error: 'There is no retailer with the informed CPF.' });
      } else {
        const cashback = cashbackByValue(req.body['value']);
        const response = Purchase.create({
          status: 200,
          value: req.body['value'],
          cashback: {
            value: cashback.value,
            percentage: cashback.percentage
          }
        }, (err, purchase) => {
          if(err) {
            return res.send({ error: err.message });
          }

          retailer[0].purchases.push(purchase);
          retailer[0].save();

          res.status(201).json({ success: 'Created' });
        });
      }
    });
  }

  async purchasesByRetailerCpf(req, res) {
    const cpfParam = cpf.format(req.params['cpf']);
    if(!cpf.isValid(req.params['cpf'])) {
      return res.status(400).send({ error: 'Invalid CPF.' });
    }

    Retailer.find({ cpf: cpfParam }).populate('purchases').then((retailer) => {
      if(!retailer.length) {
        return res.status(404).send({ error: 'There is no retailer with the informed CPF.' });
      }
      res.status(200).json(retailer[0].purchases);
    }).catch((err) => {
      res.status(500).json({err});
    });
  }
}

function cashbackByValue(value) {
  switch (true) {
    case (value < 1000):
      return { percentage: '10%', value: value * 0.1 };
      break;
    case (value >= 1000 && value <= 1500):
      return { percentage: '15%', value: value * 0.15 };
      break;
    case (value > 1500):
      return { percentage: '20%', value: value * 0.2 };
      break;
    default:
      return { percentage: '0%', value: value };
      break;
  }
}

module.exports = new PurchaseController();
