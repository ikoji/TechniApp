var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User    = require("../models/user");


router.get("/", landing);
// router.get("/register", register);
// router.post("/register", createUser);
router.get("/login", login);
// Handle login logic
router.post("/login", passport.authenticate("local", { successRedirect: "/jobs", failureRedirect: "/login", failureFlash: true }), postLogin);
router.get("/logout", logout);

module.exports = router;

// Root Route
function landing(req, res){
	// res.render("landing");
	if(req.isAuthenticated()){
		res.redirect("/jobs");
	} else {
	res.redirect("/login");
	}
}

// Register Route
function register(req, res) {
	res.render("register");
}

// Handle sign up logic
// function createUser(req, res) {
// 		var username	= req.body.username,
// 		firstName	= req.body.firstName,
// 		lastName	= req.body.lastName,
// 		email		= req.body.email,
// 		phone		= req.body.phone,
// 		title		= req.body.title,
// 		isAdmin		= req.body.isAdmin,
// 		newUser 	= new User({
// 					username: username,
// 					firstName: firstName,
// 					lastName: lastName,
// 					email: email,
// 					phone: phone,
// 					title: title,
// 					isAdmin: isAdmin
// 				});
// 	User.register(newUser, req.body.password, function(err, user){
// 		if(err){
// 			console.log(err);
// 			return res.render("register", {error: err.message});
// 		} else {
// 			passport.authenticate("local")(req, res, function(){
// 				req.flash("success", "Welcome to TechniApp " + user.username);
// 				res.redirect("/jobs");
// 			});
// 		}
// 	});
// }

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