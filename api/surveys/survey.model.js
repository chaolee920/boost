const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveySchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false
	},
	status: {
		type: Number,
		required: true
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: 'Users'
	}],
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'surveys'
});

module.exports = mongoose.model('Surveys', surveySchema);
