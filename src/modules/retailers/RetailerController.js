const Retailer = require('./Retailer');
const bcrypt = require('bcrypt');

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
    try {

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const retailer = {
        name: req.body.name, 
        cpf: req.body.cpf, 
        email: req.body.email, 
        password: hashedPassword
      };

      if(req.body.cpf === '153.509.460-56') {
        req.body.status = 'Aprovado';
      }

      const response = await Retailer.create(retailer, (err, response) => {
        if(err) {
          return res.send({ error: err.message });
        }
        res.status(201).json({ success: 'Retailer successfully created.' });
      });

    } catch {

      res.status(500).send();

    }
  }

  async login(req, res) {
    const retailer = Retailer.find({cpf: req.body.cpf}, async (err, retailer) => {
      if(retailer == null) {
        return res.status(400).send('Cannot find user');
      }
      try {
        if(await bcrypt.compare(req.body.password, retailer[0].password)) {
          req.session.retailer = retailer;
          res.status(200).json({success: 'Success'});
        } else {
          res.status(401).json({error: 'Not allowed'});
        }
      } catch {
        res.status(500).send();
      }
    });
  }

  async purchases(req, res) {
    if(!req.session.retailer) {
      return res.status(401).send();
    }

    const retailer = await Retailer.findById(req.session.retailer[0]._id).populate('purchases').then((results) => {
      res.status(200).json(results.purchases);
    }).catch((err) => {
      res.status(500).json({err});
    });
  }
}

module.exports = new RetailerController();
