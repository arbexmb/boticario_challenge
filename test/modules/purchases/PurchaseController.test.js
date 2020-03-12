const Purchase = require('../../../src/modules/purchases/Purchase');
const Retailer = require('../../../src/modules/retailers/Retailer');
const faker = require('faker');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../../src/app');
require('dotenv').config();

const agent = request.agent(app);
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
      .expect(201)
      .then(async () => {
        await request(app)
          .get('/retailers/' + cleanCpf)
          .expect(200)
          .then((res) => {
            expect(res.body.purchases.length).toBe(1);
          });
      });
  });

  it('a logged in retailer can store a purchase', async () => {
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
              .get('/retailers/purchases')
              .expect(200)
              .then((res) => {
                expect(res.body.length).toBe(1);
                expect(res.body[0].value).toBe(500);
              });
          });
      });
  });

  it("a list of a retailer's purchases it is available through its CPF", async () => {
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
              .get('/purchases/' + cleanCpf)
              .expect(200)
              .then((res) => {
                expect(res.body.length).toBe(1);
                expect(res.body[0].value).toBe(500);
              });
        });
    });
  });
});

