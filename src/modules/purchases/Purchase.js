const { Schema, model } = require('mongoose');

const PurchaseSchema = new Schema(
  {
    status: {
      value: Number,
    },
    value: {
      type: Number,
      required: true,
    },
    cashback: {
      type: Object,
      required: true,
    },
  }, {
    timestamps: true
  }
);

module.exports = model('Purchase', PurchaseSchema);
