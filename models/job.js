var mongoose = require("mongoose");

// SCHEMA SETUP
var jobSchema = new mongoose.Schema({
    jobId: Number,
    status: String,
    clientName: {
        firstName: String,
        lastName:String,
    },
    altContact: String,
    businessName: String,
    phone: String,
    altPhone: String,
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
    dmgType: String,
    folder: String,
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

jobSchema.virtual('fullAddress').get(function (){
    return this.address.apartment + " " + this.address.street + ", " + this.address.city + " " + this.address.province + " " + this.address.postal;
});

jobSchema.virtual('titleName').get(function (){
    if(this.clientName.lastName){
        return this.lastFirstName;
    } else {
        return this.businessName;
    }
})

module.exports = mongoose.model("Job", jobSchema);