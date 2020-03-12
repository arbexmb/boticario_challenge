const Purchase = require('../../../src/modules/purchases/Purchase');
const Retailer = require('../../../src/modules/retailers/Retailer');
const faker = require('faker');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../src/app');
require('dotenv').config();

const cpf = '842.018.330-03';

describe('Purchase', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.DB_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('a purchase can be associated to a retailer by its CPF', async () => {
    const mockRetailer = {
      'name': faker.name.findName(),
      'cpf': cpf,
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailer = new Retailer(mockRetailer);
    const savedRetailer = await retailer.save();
    const cleanCpf = savedRetailer.cpf.replace(/[^\d]+/g,'');

    await request(app)
      .post('/purchases/' + cleanCpf)
      .send({"value":500})
      .expect(201);

    const abc = await Retailer.findById(savedRetailer._id);
  });
});

