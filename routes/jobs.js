var express = require("express"),
    router  = express.Router(),
    Job     = require("../models/job"),
    middleware = require("../middleware");

// INDEX ROUTE - show all jobs
router.get("/", middleware.isLoggedIn, function(req, res){
	// Get all jobs from DB
	Job.find({}, function(err, allJobs){
		if(err){
			console.log(err);
		} else {
			res.render("jobs/index", {jobs:allJobs});
		}
	});
});

// CREATE ROUTE - add new job to Database
router.post("/", middleware.isLoggedIn, function(req, res){
	// Get data from form and add to jobs array
	var jobId           = req.body.jobId,
		status			= req.body.status,
		customerName    = req.body.customerName,
		phone           = req.body.phone,
		email			= req.body.email,
		street          = req.body.street,
		apartment       = req.body.apartment,
		city            = req.body.city,
		province        = req.body.province,
		postal          = req.body.postal,
		insComp         = req.body.insComp,
		policyNum       = req.body.policyNum,
		claimNum        = req.body.claimNum,
		adjComp         = req.body.adjComp,
		adjuster        = req.body.adjuster,
		fileNum         = req.body.fileNum,
		dateOfLoss      = req.body.dateOfLoss,
		deductible      = req.body.deductible,
		createdAt		= req.body.createdAt,
		modifiedAt		= req.body.modifiedAt,
		newJob	=	{
					jobId: jobId,
					status: status,
					customerName: customerName,
					phone: phone,
					email: email,
					address: 
						{
							street: street,
							apartment: apartment,
							city: city,
							province: province,
							postal: postal
						},
					insComp: insComp,
					policyNum: policyNum,
					claimNum: claimNum,
					adjComp: adjComp,
					adjuster: adjuster,
					fileNum: fileNum,
					dateOfLoss: dateOfLoss,
					deductible: deductible,
					createdAt: createdAt,
					modifiedAt: modifiedAt
					};

	// Create new job and send to DB
	Job.create(newJob, function(err,newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect to jobs page
			res.redirect("/jobs");
		}
	});
});

// NEW ROUTE - show form to create new job
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("jobs/new");
});

// SHOW ROUTE - shows more info about one job
router.get("/:id", middleware.isLoggedIn, function(req, res) {
	// find the job with provided id
	Job.findById(req.params.id).populate("comments").exec(function(err,foundJob){
	   if(err){
			res.redirect("/jobs");
	   } else {
			console.log(foundJob);
			// render show template with that job
			res.render("jobs/show", {job: foundJob});
	   }
	});
});

// EDIT JOB ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res) {
    Job.findById(req.params.id, function(err, foundJob){
       if(err){
           console.log(err);
       } else {
        res.render("jobs/edit", {job:foundJob});
       }
    });
});

// UPDATE JOB ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
	Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJob){
		if(err){
			console.log(err);
			res.redirect("/jobs");
		} else {
			res.redirect("/jobs/" + req.params.id);
		}
	});
});

// DESTROY JOB ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
	Job.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			res.redirect("/jobs");
		} else {
			res.redirect("/jobs");
		}
	});	
});

module.exports = router;