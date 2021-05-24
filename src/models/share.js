const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	title: { type: String, required: false },
	link: { type: String, required: true },
    image: { type: String, require: false },
	description: { type: String, required: false },
	category: { type: String, default: false }
},
{
  timestamps: true
});

module.exports = mongoose.model('share', ShareSchema);