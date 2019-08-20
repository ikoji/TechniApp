const mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
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
	email: String,
	phone: String,
	title: String,
	isAdmin: {
		type: Boolean,
		default: false
	}
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual('fullName').get(function () {
	return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);