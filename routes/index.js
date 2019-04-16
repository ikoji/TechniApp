var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User    = require("../models/user");


router.get("/", landing);
router.get("/register", register);
router.post("/register", createUser);
router.get("/login", login);
// Handle login logic
router.post("/login", passport.authenticate("local", { successRedirect: "/jobs", failureRedirect: "/login" }), postLogin);
router.get("/logout", logout);

module.exports = router;

// Root Route
function landing(req, res){
	res.render("landing");
}

// Register Route
function register(req, res) {
	res.render("register");
}

// Handle sign up logic
function createUser(req, res) {
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
}

// Login Route
function login(req, res) {
	res.render("login");
}

function postLogin(req, res) {

}

// Logout Route
function logout(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
}
