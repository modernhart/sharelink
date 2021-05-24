const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('mongo db connected');
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

module.exports = connectDB;