const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  platform: {
    type: String,
    default: 'Other',
  },
  url: {
    type: String,
    required: true,
  },
  savedPrice: {
    type: String,
    default: '₹0',
  },
  category: {
    type: String,
    default: 'Others',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
