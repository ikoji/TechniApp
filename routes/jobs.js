const express = require("express"),
    router = express.Router(),
    Job = require("../models/job"),
    middleware = require("../middleware");
const {
    check,
    oneOf,
    validationResult
} = require("express-validator/check");
const {
    parsePhoneNumberFromString
} = require("libphonenumber-js");

router.get("/", middleware.isLoggedIn, activeJobs);
router.get("/archive", middleware.isLoggedIn, archivedJobs);
router.get("/new", middleware.isLoggedIn, newJobRoute);
router.post("/", middleware.isLoggedIn,
            [
            check('*')
                .trim().escape(),
            check('jobId')
                .not().isEmpty()
                .withMessage("Job ID required")
                .isNumeric().withMessage("Job ID can only have numeric characters")
                .isLength({min:6, max:6}).withMessage("Job ID has to be 6 characters long")
                .custom(value => {
                    return Job.findOne({"jobId":value}).then(job => {
                        if(job) {
                            return Promise.reject('Job ID already exists');
                        }
                    });
                }),
            check('status')
                .not().isEmpty()
                .withMessage("Job Status required")
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('firstName')
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            oneOf([
                check('lastName').not().isEmpty(),
                check('businessName').not().isEmpty()
            ], "Last Name or Business Name required"),
            check('lastName')
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('businessName')
                .optional({checkFalsy: true})
                .isLength({max:60}).withMessage("60 characters max per input"),
            check('altContact')
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('phone')
                .optional({checkFalsy: true})
                .isMobilePhone('en-CA').withMessage("Invalid phone number")
                .customSanitizer(value => {
                    const phone = parsePhoneNumberFromString(value, 'CA');
                    if(phone){
                        return phone.formatNational();
                    }
                }),
            check('altPhone')
                .optional({checkFalsy: true})
                .isMobilePhone('en-CA').withMessage("Invalid alt phone number")
                .customSanitizer(value => {
                    const phone = parsePhoneNumberFromString(value, 'CA');
                    if(phone){
                        return phone.formatNational();
                    }
                }),
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
                .optional({checkFalsy:true}),
            check('dmgType')
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('folder')
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input")
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
            oneOf([
                check('job[clientName][lastName]').not().isEmpty(),
                check('job[businessName]').not().isEmpty()
            ], "Last Name or Business Name required"),
            check("job[clientName][lastName]")
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('job[businessName]')
                .optional({checkFalsy: true})
                .isLength({max:60}).withMessage("60 characters max per input"),
            check('job[altContact]')
                .optional({checkFalsy: true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('job[phone]')
                .optional({checkFalsy: true})
                .isMobilePhone('en-CA').withMessage("Invalid phone number")
                .customSanitizer(value => {
                    const phone = parsePhoneNumberFromString(value, 'CA');
                    if(phone){
                        return phone.formatNational();
                    }
                }),
            check('job[altPhone]')
                .optional({checkFalsy: true})
                .isMobilePhone('en-CA').withMessage("Invalid alt phone number")
                .customSanitizer(value => {
                    const phone = parsePhoneNumberFromString(value, 'CA');
                    if(phone){
                        return phone.formatNational();
                    }
                }),
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
                .optional({checkFalsy:true}),
            check('job[dmgType]')
                .optional({checkFalsy:true})
                .isLength({max:40}).withMessage("40 characters max per input"),
            check('job[folder]')
                .optional({checkFalsy:true})
                .isLength({max:40}).withMessage("40 characters max per input")
            ], updateJob);
router.delete("/:id", middleware.isLoggedIn, deleteJob);

module.exports = router;

// INDEX ROUTE - show jobs
function activeJobs(req, res) {
  // Get active jobs from DB
  Job.find({})
    .where("status")
    .ne("Job Complete")
    .exec(function (err, activeJobs) {
      if (err) {
        console.log(err);
      } else {
        res.render("jobs/index", {
            jobs: activeJobs,
            active: true,
        });
      }
    });
}

function archivedJobs(req, res) {
  // Get archived jobs from DB
  Job.find({})
    .where("status")
    .equals("Job Complete")
    .exec(function (err, archivedjobs) {
      if (err) {
        console.log(err);
      } else {
        res.render("jobs/index", {
          jobs: archivedjobs,
          active: false,
        });
      }
    });
}

// NEW ROUTE - show form to create new job
function newJobRoute(req, res) {

    Job.find({}).sort({jobId: -1}).select('jobId').exec(function(err,job){
        if (err) return console.log(err);
        const jobIds = [];
        job.forEach(job => jobIds.push(job.jobId.toString()));
        const locals = [];
        jobIds.forEach(jobids => locals.push(jobids.charAt(2)));
        const uniqueLocals = [...new Set(locals)];
        const maxJobIds = [];
        uniqueLocals.forEach(unique => maxJobIds.push(Math.max(...jobIds.filter(jobIds => jobIds.charAt(2) == unique))+1));
        const newJob = {
            jobId: null,		
            status: null,
            clientName: {
                firstName: null,
                lastName: null
            },
            altContact: null,
            businessName: null,
            phone: null,
            altPhone: null,
            email: null,
            address: {
                street: null,
                apartment: null,
                city: null,
                province: null,
                postal: null
            },
            insComp: null,
            policyNum: null,
            claimNum: null,
            adjComp: null,
            adjuster: null,
            fileNum: null,
            dateOfLoss: null,
            dmgType: null,
            folder: null,
            deductible: null,
            createdAt: null,
            modifiedAt: null
        };
        res.render("jobs/new", {
            newJob: newJob,
            maxJobIds: maxJobIds
        });
    });
}

// CREATE ROUTE - add new job to Database
async function createJob(req, res) {
    const errors = validationResult(req);
    // Get data from form and add to jobs array
    const jobId = req.body.jobId,
        status = req.body.status,
        firstName = req.body.firstName,
        lastName = req.body.lastName,
        altContact = req.body.altContact,
        businessName = req.body.businessName,
        phone = req.body.phone,
        altPhone = req.body.altPhone,
        email = req.body.email,
        street = req.body.street,
        apartment = req.body.apartment,
        city = req.body.city,
        province = req.body.province,
        postal = req.body.postal,
        insComp = req.body.insComp,
        policyNum = req.body.policyNum,
        claimNum = req.body.claimNum,
        adjComp = req.body.adjComp,
        adjuster = req.body.adjuster,
        fileNum = req.body.fileNum,
        dateOfLoss = req.body.dateOfLoss,
        dmgType = req.body.dmgType,
        folder = req.body.folder,
        deductible = req.body.deductible,
        createdAt = req.body.createdAt,
        modifiedAt = req.body.modifiedAt,
        newJob = {
            jobId: jobId,
            status: status,
            clientName: {
                firstName: firstName,
                lastName: lastName
            },
            altContact: altContact,
            businessName: businessName,
            phone: phone,
            altPhone: altPhone,
            email: email,
            address: {
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
            dmgType: dmgType,
            folder: folder,
            deductible: deductible,
            createdAt: createdAt,
            modifiedAt: modifiedAt
        };
    if (!errors.isEmpty()) {
        let error = [];
        errors.array().forEach(function (err) {
            error.push(err.msg);
        });

        const job = await Job.find({}).sort({jobId: -1}).select('jobId');
            
        const jobIds = [];
        job.forEach(job => jobIds.push(job.jobId.toString()));
        const locals = [];
        jobIds.forEach(jobids => locals.push(jobids.charAt(2)));
        const uniqueLocals = [...new Set(locals)];
        const maxJobIds = [];
        uniqueLocals.forEach(unique => maxJobIds.push(Math.max(...jobIds.filter(jobIds => jobIds.charAt(2) == unique))+1));
        
        res.render("jobs/new", {
            error: error,
            newJob: newJob,
            maxJobIds: maxJobIds
        });
    } else {
        // Create new job and send to DB
        try {
            await Job.create(newJob);

            // redirect to jobs page
            res.redirect("/jobs");
        }
        catch (err){
            console.error(err);
        }
    }
}




// SHOW ROUTE - shows more info about one job
function showJob(req, res) {
    // find the job with provided id
    Job.findById(req.params.id).populate("comments").exec(function (err, foundJob) {
        if (err) {
            res.redirect("/jobs");
        } else {
            console.log(foundJob);
            // render show template with that job
            res.render("jobs/show", {
                job: foundJob
            });
        }
    });
}

// EDIT JOB ROUTE
function editJob(req, res) {
    Job.findById(req.params.id, function (err, foundJob) {
        if (err) {
            console.log(err);
        } else {
            res.render("jobs/edit", {
                job: foundJob
            });
        }
    });
}

// UPDATE JOB ROUTE
function updateJob(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(function (err) {
            req.flash("error", err.msg);
        });
        res.redirect("/jobs/" + req.params.id + "/edit");
    } else {
        Job.findByIdAndUpdate(req.params.id, req.body.job, function (err, updatedJob) {
            if (err) {
                console.log(err);
                res.redirect("/jobs");
            } else {
                res.redirect("/jobs/" + req.params.id);
            }
        });
    }
}

// DESTROY JOB ROUTE
function deleteJob(req, res) {
    Job.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/jobs");
        } else {
            res.redirect("/jobs");
        }
    });
}
