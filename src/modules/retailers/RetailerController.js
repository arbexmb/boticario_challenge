const Retailer = require('./Retailer');
const bcrypt = require('bcrypt');
const request = require('request');
const { cpf } = require('cpf-cnpj-validator');
const logger = require('../../utils/logger');

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
        retailer.status = 'Aprovado';
      }

      const response = await Retailer.create(retailer, (err, response) => {
        if(err) {
          return res.send({ error: err.message });
        }
        logger.info('A new retailer (CPF: ' + retailer.cpf + ') was created.');
        res.status(201).json({ success: 'Retailer successfully created.' });
      });

    } catch {

      res.status(500).send();

    }
  }

  async findByCpf(req, res) {
    const cpfParam = cpf.format(req.params['cpf']);
    if(!cpf.isValid(req.params['cpf'])) {
      return res.status(500).json({ error: 'Invalid CPF.' });
    }
    const retailer = Retailer.find({ cpf: cpfParam }, (err, retailer) => {
      if(err) {
        res.status(500).json({ error: err.message });
      }
      if(retailer.length < 1) {
        return res.status(404).json({ error: 'Cannot find retailer.' });
      }

      res.status(200).json(retailer[0]);
    });
  }

  async login(req, res) {
    if(req.session.retailer && process.env.NODE_ENV !== 'test') {
      return res.status(500).json({error: 'Please, logout from your current session, in order to login.'});
    }
    const retailer = Retailer.find({cpf: req.body.cpf}, async (err, retailer) => {
      if(retailer.length < 1) {
        return res.status(404).json({ error: 'Cannot find retailer.' });
      }
      try {
        if(await bcrypt.compare(req.body.password, retailer[0].password)) {
          req.session.retailer = retailer;
          logger.info('Retailer (CPF: ' + retailer[0].cpf + ') logged in.');
          res.status(200).json({success: 'Success!'});
        } else {
          res.status(401).json({error: 'Not allowed.'});
        }
      } catch(err) {
        res.status(500).json({error: err.message});
      }
    });
  }

  async logout(req, res) {
    if(!req.session.retailer) {
      return res.status(401).json({error: 'You are not logged in.'});
    }

    logger.info('Retailer (CPF: ' + req.session.retailer[0].cpf + ') logged out.');

    req.session.retailer = null;
    res.status(200).json({ success: 'Logged out succesfully.' });
  }

  async purchases(req, res) {
    if(!req.session.retailer) {
      return res.status(401).json({ error: 'You are not logged in.' });
    }

    const retailer = await Retailer.findById(req.session.retailer[0]._id).populate('purchases').then((result) => {
      logger.info('Retailer (CPF: ' + result.cpf + ') has checked its purchases info.');
      res.status(200).json(result.purchases);
    }).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  }

  async cashbackTotal(req, res) {
    if(!req.session.retailer) {
      return res.status(401).json({error: 'You are not logged in.'});
    }

    const retailer = await Retailer.findById(req.session.retailer[0]._id).populate('purchases').then((result) => {
      let cashback = 0;
      result.purchases.forEach((purchase) => {
        const value = parseInt(purchase.cashback.value);
        cashback += value;
      });
      logger.info('Retailer (CPF: ' + result.cpf + ') has checked its cashback info.');
      res.status(200).json({ cashback: cashback });
    }).catch((err) => {
      res.status(500).json({ error: err.message })
    });
  }

  async cashbackApi(req, res) {
    const headers = { token: 'ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm' }
    const cpfParam = req.params['cpf'];
    if(!cpf.isValid(cpfParam)) {
      return res.status(500).json({ error: 'Invalid CPF.' });
    }
    const api = await request({ headers: headers,
        uri: 'https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback?cpf=' + cpfParam,
        method: 'GET'
    }, (err, response, body) => {
      if(err) {
        return res.send({ error: err.message });
      }
      const object = JSON.parse(body);
      res.status(200).json(object.body);
    });
  }
  
  async cashbackTotalByCpf(req, res) {
    const cpfParam = cpf.format(req.params['cpf']);
    if(!cpf.isValid(req.params['cpf'])) {
      return res.status(400).send({ error: 'Invalid CPF.' });
    }
    const retailer = await Retailer.find({ cpf: cpfParam }).populate('purchases').then((results) => {
      let cashback = 0;
      results[0].purchases.forEach((purchase) => {
        const value = parseInt(purchase.cashback.value);
        cashback += value;
      });
      res.status(200).json({ cashback: cashback });
    }).catch((err) => {
      res.status(500).json({ error: err.message })
    });
  }
}

module.exports = new RetailerController();
