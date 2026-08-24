const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true } );

registrationSchema.index({ event: 1, attendee: 1 }, { unique: true } );

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;