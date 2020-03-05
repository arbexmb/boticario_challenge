const { Schema, model } = require('mongoose');

const PurchaseSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
  }, {
    timestamps: true
  }
);

module.exports = model('Purchase', PurchaseSchema);
