const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	roles: [ String ],
	passwordHash: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: false
	},
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
}, {
	collection: 'users'
});

module.exports = mongoose.model('Users', userSchema);
