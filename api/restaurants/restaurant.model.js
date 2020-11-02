const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	goal: {
		type: Number,
		required: true,
		default: 0,
	},
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'restaurants'
});

module.exports = mongoose.model('Restaurants', restaurantSchema);
