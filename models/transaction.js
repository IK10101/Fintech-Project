const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        enum: ['credit','debit'],
        required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    category: {
      type: String,
      enum: ['food','transport','salary','shopping','other'],

    },

    description: {
    type: String,
    trim: true
  },

    balanceAfter: {
    type: Number    
  },

    createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Transaction', transactionSchema);

