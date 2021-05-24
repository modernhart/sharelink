const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	profile: { type: String, required: false },
	name: { type: String, required: false }
},
{
  timestamps: true
});

module.exports = mongoose.model('user', UserSchema);