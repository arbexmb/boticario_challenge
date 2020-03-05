const Retailer = require('./Retailer');

class RetailerController {
  async index(req, res) {
    const retailers = Retailer.find({}, (err, results) => {
      if(err) {
        return res.send({ error: err.message });
      }
      res.status(200).json(results);
    });
  }

  async store(req, res) {
    const { name, cpf, email, password } = req.body;

    if(req.body.cpf === '153.509.460-56') {
      req.body.status = 'Aprovado';
    }

    const response = await Retailer.create(req.body, (err, response) => {
      if(err) {
        return res.send({ error: err.message });
      }
      res.status(201).json({ success: 'Retailer successfully created.' });
    });
  }

  async purchases(req, res) {
    //const retailer = await Retailer.findById(req.params['id'], (err, retailer) => {
    //  if(err) {
    //    return res.send({ error: err.message });
    //  }

    //  res.send(retailer.purchases);
    //});
    const retailer = await Retailer.findById(req.params['id']).populate('purchases').then((results) => {
      res.json(results);
    }).catch((err) => {
      res.status(500).json({err});
    });
  }
}

module.exports = new RetailerController();
