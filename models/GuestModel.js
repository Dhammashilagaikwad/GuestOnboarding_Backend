const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel', 
    required: true,
  },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  purposeOfVisit: { type: String, required: true },
  stayFrom: { type: Date, required: true },
  stayTo: { type: Date, required: true },
  email: { type: String, required: true },
  idProof: { type: String, required: true },
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
