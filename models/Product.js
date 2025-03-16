// definición del esquema del producto utilizando Mongoose.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios']
  },
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL']
  },
  price: {
    type: Number,
    required: true,
  },

});

module.exports = mongoose.model('Product', productSchema);