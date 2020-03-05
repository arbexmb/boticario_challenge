const { Schema, model } = require('mongoose');

const RetailerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cpf: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'Em validação'
    },
    purchases: [{
      type: Schema.Types.ObjectId,
      ref: 'Purchase'
    }]
  }
);

module.exports = model('Retailer', RetailerSchema);
