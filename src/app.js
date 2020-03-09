const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./database/index');
const session = require('express-session');
require('dotenv').config();

class AppController {
    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: true
        }));
    }

    routes() {
        this.express.use(require('./routes'));
    }
}

module.exports = new AppController().express
