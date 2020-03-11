const faker = require('faker');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../../../src/app');
const Retailer = require('../../../src/modules/retailers/Retailer');
require('dotenv').config();

const cpf = '842.018.330-03';

describe('RetailerController', () => {
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

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should insert new retailer via API', async () => {
    const mockRetailer = {
      'name': faker.name.findName(),
      'cpf': '395.697.988-58',
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };

    return request(app)
      .post('/retailers')
      .send(mockRetailer)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success');
      });
  });

  it('should retrieve a list of Retailers', async () => {
    const mockRetailerOne = {
      'name': faker.name.findName(),
      'cpf': cpf,
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailerOne = new Retailer(mockRetailerOne);
    const savedRetailerOne = await retailerOne.save();

    const mockRetailerTwo = {
      'name': faker.name.findName(),
      'cpf': '209.784.990-34',
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailerTwo = new Retailer(mockRetailerTwo);
    const savedRetailerTwo = await retailerTwo.save();

    return request(app)
      .get('/retailers')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe(retailerOne.name);
        expect(res.body[1].name).toBe(retailerTwo.name);
        expect(res.body).toHaveLength(2);
      });
  });

  it('a user can login into the application', async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password', salt);
    const mockRetailer = {
      'name': faker.name.findName(),
      'cpf': cpf,
      'email': faker.internet.email(),
      'password': hashedPassword
    };
    const retailer = new Retailer(mockRetailer);
    const savedRetailer = await retailer.save();

    return request(app)
      .post('/retailers/login')
      .send({ "cpf": cpf, "password": 'password' })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('success');
      });
  });
});
