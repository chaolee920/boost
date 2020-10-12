const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promoSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true
	},
	restaurant: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurants'
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'promos'
});

module.exports = mongoose.model('Promos', promoSchema);
