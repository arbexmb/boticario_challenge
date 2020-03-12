const Purchase = require('../../../src/modules/purchases/Purchase');
const faker = require('faker');
const mongoose = require('mongoose');
require('dotenv').config();

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

  it('a valid purchase can be instantiated', async () => {
    const value = faker.random.number({'min': 20, 'max': 5000});

    const purchase = new Purchase({
      value: value,
      cashback: {
        value: 12,
        percentage: 'X%'
      }
    });
    const savedPurchase = await purchase.save();

    const storedPurchases = await Purchase.find({});
    expect(storedPurchases.length).toBe(1);
  });

  it ('a cashback is required for every purchase', async () => {
    const value = faker.random.number({'min': 20, 'max': 5000});

    const purchase = new Purchase({
      value: value 
    });

    let err;
    try {
      const savedPurchase = await purchase.save();
      error = savedPurchase;
    } catch(error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.cashback).toBeDefined();
  });
  
  it ('a value is required to instantiate a purchase', async () => {
    const value = faker.random.number({'min': 20, 'max': 5000});

    const purchase = new Purchase({
      cashback: {
        value: 12,
        percentage: 'X%'
      }
    });

    let err;
    try {
      const savedPurchase = await purchase.save();
      error = savedPurchase;
    } catch(error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.value).toBeDefined();
  });
});

