const Retailer = require('../../../src/modules/retailers/Retailer');
const faker = require('faker');
const mongoose = require('mongoose');
require('dotenv').config();

const cpf = '842.018.330-03';

describe('Retailer', () => {
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

  it('a valid Retailer can be instantiated', async () => {
    const mockRetailer = {
      'name': faker.name.findName(),
      'cpf': cpf,
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailer = new Retailer(mockRetailer);
    const savedRetailer = await retailer.save();

    expect(savedRetailer.cpf).toBe(cpf);
  });

  it('a name is required in order to instantiate a Retailer', async () => {
    const mockRetailer = {
      'cpf': cpf,
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailer = new Retailer(mockRetailer);

    let err;
    try {
      const savedRetailer = await retailer.save();
      error = savedRetailer;
    } catch(error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('a cpf is required in order to instantiate a Retailer', async () => {
    const mockRetailer = {
      'name': faker.name.findName(),
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailer = new Retailer(mockRetailer);
    
    let err;
    try {
      const savedRetailer = await retailer.save();
      error = savedRetailer;
    } catch(error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.cpf).toBeDefined();
  });
  
  it('a cpf must be unique in order to instantiate a Retailer', async () => {
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
      'cpf': cpf,
      'email': faker.internet.email(),
      'password': faker.internet.password()
    };
    const retailerTwo = new Retailer(mockRetailerTwo);

    let err;
    try {
      const savedRetailerTwo = await retailerTwo.save();
      error = savedRetailerTwo;
    } catch(error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.cpf).toBeDefined();
  });
  
  it('an email is required in order to instantiate a Retailer', async () => {
    const mockRetailer = {
      'name': faker.name.findName(),
      'cpf': cpf,
      'password': faker.internet.password()
    };
    const retailer = new Retailer(mockRetailer);
    
    let err;
    try {
      const savedRetailer = await retailer.save();
      error = savedRetailer;
    } catch(error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});
