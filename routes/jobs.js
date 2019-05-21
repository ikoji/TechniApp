var express = require("express"),
	router  = express.Router(),
	Job     = require("../models/job"),
	middleware = require("../middleware");
const { check, validationResult } = require('express-validator/check');

router.get("/", middleware.isLoggedIn, allJobs);
router.get("/new", middleware.isLoggedIn, newJobRoute);
router.post("/", middleware.isLoggedIn,
			[
			check('*')
				.trim().escape(),
			check('jobId')
				.not().isEmpty()
				.withMessage("Job ID required")
				.isNumeric().withMessage("Job ID can only have numeric characters")
				.isLength({min:6, max:6}).withMessage("Job ID has to be 6 characters long"),
			check('status')
				.not().isEmpty()
				.withMessage("Job Status required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('firstName')
				.optional({checkFalsy: true})
				.not().isEmpty()
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('lastName')
				.not().isEmpty()
				.withMessage("Last Name required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('phone')
				.optional({checkFalsy: true})
				.isMobilePhone().withMessage("Invalid phone number"),
			check('email')
				.optional({checkFalsy: true})
				.isEmail().withMessage("Please provide a valid email address")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('street')
				.optional({checkFalsy: true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('apartment')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('city')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('province')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('postal')
				.optional({checkFalsy:true})
				.isPostalCode('CA')
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('insComp')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('policyNum')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('claimNum')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('adjComp')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('adjuster')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('fileNum')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('dateOfLoss')
				.optional({checkFalsy:true})
			], createJob);
router.get("/:id", middleware.isLoggedIn, showJob);
router.get("/:id/edit", middleware.isLoggedIn, editJob);
router.put("/:id", middleware.isLoggedIn,
			[
			check('*')
				.optional({checkFalsy: true})
				.trim().escape(),
			check('job[jobId]')
				.not().isEmpty()
				.withMessage("Job ID required")
				.isNumeric().withMessage("Job ID can only have numeric characters")
				.isLength({min:6, max:6}).withMessage("Job ID has to be 6 characters long"),
			check('job[status]')
				.not().isEmpty()
				.withMessage("Job Status required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[clientName][firstName]')
				.optional({checkFalsy: true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check("job[clientName][lastName]")
				.not().isEmpty()
				.withMessage("Last Name required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[phone]')
				.optional({checkFalsy: true})
				.isMobilePhone().withMessage("Invalid phone number"),
			check('job[email]')
				.optional({checkFalsy: true})
				.isEmail().withMessage("Please provide a valid email address")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[address][street]')
				.optional({checkFalsy: true})
				.not().isEmpty()
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[address][apartment]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[address][city]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[address][province]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[address][postal]')
				.optional({checkFalsy:true})
				.isPostalCode('CA')
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[insComp]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[policyNum]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[claimNum]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[adjComp]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[adjuster]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[fileNum]')
				.optional({checkFalsy:true})
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('job[dateOfLoss]')
				.optional({checkFalsy:true})
			], updateJob);
router.delete("/:id", middleware.isLoggedIn, deleteJob);

module.exports = router;

// INDEX ROUTE - show all jobs
function allJobs(req, res){
	// Get all jobs from DB
	Job.find({}, function(err, allJobs){
		if(err){
			console.log(err);
		} else {
			res.render("jobs/index", {jobs:allJobs});
		}
	});
}

// NEW ROUTE - show form to create new job
function newJobRoute(req, res) {
   res.render("jobs/new");
}

// CREATE ROUTE - add new job to Database
function createJob(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach(function(err){
			req.flash("error", err.msg);
		});
		res.redirect("/jobs/new");
	} else {
		// Get data from form and add to jobs array
		var jobId           = req.body.jobId,
			status			= req.body.status,
			firstName		= req.body.firstName,
			lastName 		= req.body.lastName,
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
			deductible		= req.body.deductible,
			createdAt		= req.body.createdAt,
			modifiedAt		= req.body.modifiedAt,
			newJob	=	{
						jobId: jobId,
						status: status,
						clientName: 
							{
								firstName: firstName,
								lastName: lastName
							},
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
	}
}

// SHOW ROUTE - shows more info about one job
function showJob(req, res) {
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
}

// EDIT JOB ROUTE
function editJob(req, res) {
	Job.findById(req.params.id, function(err, foundJob){
	   if(err){
		   console.log(err);
	   } else {
		res.render("jobs/edit", {job:foundJob});
	   }
	});
}

// UPDATE JOB ROUTE
function updateJob(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach(function(err){
			req.flash("error", err.msg);
		});
		res.redirect("/jobs/"+req.params.id+"/edit");
	} else {
		Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJob){
			if(err){
				console.log(err);
				res.redirect("/jobs");
			} else {
				res.redirect("/jobs/" + req.params.id);
			}
		});
	}
}

// DESTROY JOB ROUTE
function deleteJob(req, res){
	Job.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			res.redirect("/jobs");
		} else {
			res.redirect("/jobs");
		}
	});
}
