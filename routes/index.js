const express = require("express"),
	router = express.Router(),
	passport = require("passport");

router.get("/", landing);
router.get("/login", login);
// Handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/jobs",
	failureRedirect: "/login",
	failureFlash: true
}), postLogin);
router.get("/logout", logout);

module.exports = router;

// Root Route
function landing(req, res) {
	// res.render("landing");
	if (req.isAuthenticated()) {
		res.redirect("/jobs");
	} else {
		res.redirect("/login");
	}
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