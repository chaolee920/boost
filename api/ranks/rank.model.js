const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rankSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	rank: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	sold: {
		type: Number,
		required: true
	},
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'ranks'
});

module.exports = mongoose.model('Ranks', rankSchema);
