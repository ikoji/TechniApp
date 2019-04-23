var mongoose = require("mongoose");

// SCHEMA SETUP
var jobSchema = new mongoose.Schema({
    jobId: Number,
    status: String,
    clientName: {
        firstName: String,
        lastName:String,
    },
    phone: String,
    email: String,
    address: {
        street: String,
        apartment: String,
        city: String,
        province: String,
        postal: String
    },
    insComp: String,
    policyNum: String,
    claimNum: String,
    adjComp: String,
    adjuster: String,
    fileNum: String,
    dateOfLoss: Date,
    deductible: Number,
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

jobSchema.virtual('fullName').get(function (){
	return this.clientName.firstName + ' ' + this.clientName.lastName;
});

jobSchema.virtual('lastFirstName').get(function (){
	return this.clientName.lastName + ', ' + this.clientName.firstName;
});

module.exports = mongoose.model("Job", jobSchema);