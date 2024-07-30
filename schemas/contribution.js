const mongoose = require('mongoose');
const { Schema } = mongoose;
const { AnalysisSchema } = require('./analysis');

const ContributionSchema = new Schema({
  sha: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  },
  languages: [{
    type: String,
  }],
  analysis: {
    type: AnalysisSchema,
  },
});

module.exports = { ContributionSchema };