const mongoose = require('mongoose');
const { ContributionSchema } = require('./contribution');
const { Schema } = mongoose;

const CommitterSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  contributions: [
    ContributionSchema
  ],
});


module.exports = { CommitterSchema };