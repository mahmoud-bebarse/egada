const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    status: { type: Boolean, default: true },
    entryDate: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
module.exports = User;