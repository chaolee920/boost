const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
	promo: {
		type: Schema.Types.ObjectId,
		ref: 'Promos'
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	status: {
		type: Number,
		required: true
	},
	sold: [{
		type: Date,
	}],
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'subscribes'
});

module.exports = mongoose.model('Subscribes', subscribeSchema);
