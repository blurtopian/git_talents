const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const AnalysisSchema = new Schema({
  author: {
    type: String,
  },
  date: {
    type: Date,
  },
  message: {
    type: String,
  },
  totalFiles: {
    type: Number,
  },
  totalLinesAdded: {
    type: Number,
  },
  totalLinesDeleted: {
    type: Number,
  },
  nature: {
    type: String,
  },
  scope: {
    type: String,
  },
});

module.exports = { AnalysisSchema };