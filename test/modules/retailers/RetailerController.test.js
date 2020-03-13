const faker = require('faker');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../../../src/app');
const Retailer = require('../../../src/modules/retailers/Retailer');
require('dotenv').config();

const agent = request.agent(app);
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

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should insert new retailer via application', async () => {
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

  it('a retailer can login into the application', async () => {
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

    await agent
      .post('/retailers/login')
      .send({ "cpf": cpf, "password": 'password' })
      .expect(200)
      .then(async (res) => {
        await agent
          .get('/retailers/purchases')
          .expect(200);
      });
  });

  it('a logged in retailer can check its purchases', async () => {
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

    await agent
      .post('/retailers/login')
      .send({"cpf":savedRetailer.cpf,"password":"password"})
      .expect(200)
      .then(async () => {
        await agent
          .post('/purchases')
          .send({"value":1234})
          .expect(201)
          .then(async () => {
            await agent
              .get('/retailers/purchases')
              .expect(200)
              .then((res) => {
                expect(res.body.length).toBe(1);
                expect(res.body[0].value).toBe(1234);
              });
          });
      });
  });
  
  it('a logged in retailer can check its cashback', async () => {
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
    const cleanCpf = savedRetailer.cpf.replace(/[^\d]+/g,'');

    await agent
      .post('/retailers/login')
      .send({"cpf":savedRetailer.cpf,"password":"password"})
      .expect(200)
      .then(async () => {
        await agent
          .post('/purchases')
          .send({"value":500})
          .expect(201)
          .then(async () => {
            await agent
              .get('/retailers/cashback')
              .expect(200)
              .then((res) => {
                expect(res.body.cashback).toBe(50);
              });
          });
      });
  });

  it('a logged in retailer can logout of the application', async () => {
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
    const cleanCpf = savedRetailer.cpf.replace(/[^\d]+/g,'');

    await agent
      .post('/retailers/login')
      .send({"cpf":savedRetailer.cpf,"password":"password"})
      .expect(200)
      .then(async () => {
        await agent
          .get('/retailers/logout')
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('success');
          });
      });
  });
});
