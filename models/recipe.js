// models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeID: String,
  name: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  colorCodes: [
    {
      name: String,
      codeColor: String,
      quantity: Number,
    }
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
