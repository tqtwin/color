// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
});

// Virtual để populate recipes
companySchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'company',
});

companySchema.set('toObject', { virtuals: true });
companySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Company', companySchema);
