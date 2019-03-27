var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User    = require("../models/user");

// Root Route
router.get("/", function(req, res){
	res.render("landing");
});

// ====================
// AUTHORIZATION ROUTES
// ====================

// Register Route
router.get("/register", function(req, res) {
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to TechniApp " + user.username);
				res.redirect("/jobs");
			});
		}
   });
});

// Login Route
router.get("/login", function(req, res) {
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/jobs",
		failureRedirect: "/login"
	}), function(req, res) {

});

// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;