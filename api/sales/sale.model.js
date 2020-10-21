const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
	subscription: {
		type: Schema.Types.ObjectId,
		ref: 'Subscribes'
	},
	status: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
	},
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'sales'
});

module.exports = mongoose.model('Sales', saleSchema);
