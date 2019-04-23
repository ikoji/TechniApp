const express	= require("express"),
	router		= express.Router(),
	User		= require("../models/user"),
	middleware	= require("../middleware"),
	passport	= require("passport");

router.get("/", middleware.isLoggedIn, allUsers);
router.get("/new", middleware.isAdmin, newUserRoute);
router.post("/", middleware.isAdmin, createUser);
router.get("/:id", middleware.isLoggedIn, showUser);
router.get("/:id/edit", middleware.checkUserOwnership, editUser);
router.put("/:id", middleware.checkUserOwnership, updateUser);
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
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			console.log(err);
			res.redirect("/users");
		} else {
			res.redirect("/users");
		}
	});
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