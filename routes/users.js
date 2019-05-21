const express	= require("express"),
	router		= express.Router(),
	User		= require("../models/user"),
	middleware	= require("../middleware");
const { check, validationResult } = require('express-validator/check');

router.get("/", middleware.isLoggedIn, allUsers);
router.get("/new", middleware.isAdmin, newUserRoute);
router.post("/",
			middleware.isAdmin, [
			check('username')
				.not().isEmpty()
				.trim().escape()
				.withMessage("Username required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('firstName')
				.not().isEmpty()
				.trim().escape()
				.withMessage("First Name required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('lastName')
				.not().isEmpty()
				.trim().escape()
				.withMessage("Last Name required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('email')
				.optional({checkFalsy: true})
				.isEmail().withMessage("Please provide a valid email address")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('phone')
				.optional({checkFalsy: true})
				.trim().escape()
				.isMobilePhone().withMessage("Invalid phone number"),
			check('title')
				.optional({checkFalsy:true})
				.trim().escape()
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('password')
				.not().isEmpty().withMessage("Please enter a password")
				.trim().escape()
				.isLength({min: 5}).withMessage("Password must be at least 5 characters long"),
			check('confirmPassword')
				.not().isEmpty().withMessage("Please confirm password")
				.trim().escape()
				.custom((value, { req }) => value === req.body.password)
				.withMessage("Passwords do not match"),
			],
			createUser);
router.get("/:id", middleware.isLoggedIn, showUser);
router.get("/:id/edit", middleware.checkUserOwnership, editUser);
router.put("/:id",
			middleware.checkUserOwnership, [
			check('user.username')
				.not().isEmpty()
				.trim().escape()
				.withMessage("Username required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('user.firstName')
				.not().isEmpty()
				.trim().escape()
				.withMessage("First Name required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('user.lastName')
				.not().isEmpty()
				.trim().escape()
				.withMessage("Last Name required")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('user.email')
				.optional({checkFalsy: true})
				.isEmail().withMessage("Please provide a valid email address")
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('user.phone')
				.optional({checkFalsy: true})
				.trim().escape()
				.isMobilePhone().withMessage("Invalid phone number"),
			check('user.title')
				.optional({checkFalsy:true})
				.trim().escape()
				.isLength({max:40}).withMessage("40 characters max per input"),
			check('user.password')
				.optional({checkFalsy:true})
				.not().isEmpty().withMessage("Please enter a password")
				.trim().escape()
				.isLength({min: 5}).withMessage("Password must be at least 5 characters long"),
			check('user.confirmPassword')
				.optional({checkFalsy:true})
				.not().isEmpty().withMessage("Please confirm password")
				.trim().escape()
				.custom((value, { req }) => value === req.body.user.password)
				.withMessage("Passwords do not match"),
			],
			updateUser);
router.delete("/:id", middleware.isAdmin, deleteUser);

module.exports = router;

// INDEX ROUTE - show all Users
function allUsers(req, res){
	// Get all Users from DB
	User.find({}, function(err, allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("users/index", {users:allUsers});
		}
	});
}

// NEW ROUTE - show form to create new user
function newUserRoute(req, res) {
   res.render("users/new");
}

// CREATE ROUTE - add new user to Database
function createUser(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach(function(err){
			req.flash("error", err.msg);
		});
		res.redirect("/users/new");
	} else {
		// Get data from form and add to users array
		var username	= req.body.username,
			firstName	= req.body.firstName,
			lastName	= req.body.lastName,
			email		= req.body.email,
			phone		= req.body.phone,
			title		= req.body.title,
			isAdmin		= req.body.isAdmin,
			newUser={
						username: username,
						firstName: firstName,
						lastName: lastName,
						email: email,
						phone: phone,
						title: title,
						isAdmin: isAdmin
					};
		// Create new user and send to DB
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				console.log(err);
				req.flash("error", err.message);
				res.redirect("/users");
			} else {
				req.flash("success", "New user created: " + user.username);
				res.redirect("/users");
			}
		});
	}
}

// SHOW ROUTE - shows more info about one user - not currently available
function showUser(req, res) {
	// find the user with provided id
	User.findById(req.params.id, function(err, foundUser){
	   if(err){
			res.redirect("/users");
	   } else {
			console.log(foundUser);
			res.redirect("/users");
			// render show template with that user
			// res.render("users/show", {user: foundUser});
	   }
	});
}

// EDIT USER ROUTE
function editUser(req, res) {
	User.findById(req.params.id, function(err, foundUser){
	   if(err){
		   console.log(err);
	   } else {
		res.render("users/edit", {user:foundUser});
	   }
	});
}

// UPDATE USER ROUTE
function updateUser(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach(function(err){
			req.flash("error", err.msg);
		});
		res.redirect("/users/"+req.params.id+"/edit");
	} else {
		User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
			if(err){
				console.log(err);
				res.redirect("/users");
			} else {
				if(req.body.password !== ""){
					if(req.body.password !== req.body.confirmPassword) {
						req.flash("error","Passwords do not match");
						res.redirect("/users/"+req.params.id+"/edit");
					} else {
						user.setPassword(req.body.password, function(err,user){
							if (err) {
								req.flash("error", "Password could not be saved. Please try again!");
								res.redirect("/users");
							} else {
								user.save();
								req.flash("success", "New password has been saved successfully");
								res.redirect("/users");
							}
						});
					}
				} else {
					req.flash("success", "Saved successfully");
					res.redirect("/users");
				}
			}
		});
	}
}

// DESTROY USER ROUTE
function deleteUser(req, res){
	User.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			res.redirect("/users");
		} else {
			res.redirect("/users");
		}
	});
}
