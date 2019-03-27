var mongoose    = require("mongoose"),
    Job         = require("./models/job"),
    Comment     = require("./models/comment");


var data = [
    {
        jobId: "191009",
        customerName: "Tim Henschel",
        phone: "2506403885",
        address: {
            street: "3604 Eby St",
            apartment: "",
            city: "Terrace",
            province: "BC",
            postal: "V8G 2Z3"
        },
        insComp: "Westland",
        policyNum: "WIP1230740",
        claimNum: "59500",
        adjComp: "NIIA",
        adjuster: "Michelle Riley",
        fileNum: "T18-5168-M",
        dateOfLoss: "",
        deductible: "1000"
    },
    {
        jobId: "183010",
        customerName: "Andrew Murphy",
        phone: "2506396219",
        address: {
            street: "18 Moore Street",
            apartment: "",
            city: "Kitimat",
            province: "BC",
            postal: "V8C 1G7"
        },
        insComp: "The Personal",
        policyNum: "H4106030",
        claimNum: "Q1690942",
        adjComp: "ClaimsPro",
        adjuster: "Susan McKie",
        fileNum: "54810-745320",
        dateOfLoss: "",
        deductible: ""
    },
    {
        jobId: "191006",
        customerName: "Jaron Janas",
        phone: "2506313224",
        address: {
            street: "5225 Dover Road",
            apartment: "",
            city: "Terrace",
            province: "BC",
            postal: "V8G 0C3"
        },
        insComp: "Westland",
        policyNum: "WIP1188602",
        claimNum: "58845",
        adjComp: "NIIA",
        adjuster: "Michelle Riley",
        fileNum: "T18-5144-M",
        dateOfLoss: "",
        deductible: "1000"
    }
    ];

function seedDB(){
    // Remove all jobs
    Job.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Removed jobs");
            // Add a few jobs
            data.forEach(function(seed){
                Job.create(seed, function(err, job){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added a job");
                        // Create a comment
                        Comment.create(
                            {
                                text: "Why hasn't anyone done anything on this job yet?",
                                author: "Clint Dalla Vecchia"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else { 
                                    job.comments.push(comment);
                                    job.save();
                                    console.log("Created a comment");
                                }
                        });
                    }
                });
            });
        }
    });
    // Add a few comments
    
}

module.exports = seedDB;