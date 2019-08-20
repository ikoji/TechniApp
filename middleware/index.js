const Comment = require("../models/comment"),
	User = require("../models/user");
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("/login");
	}
};

middlewareObj.isAdmin = function (req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.isAdmin) {
			return next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("/login");
	}
};

middlewareObj.checkUserOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		User.findById(req.params.id, function (err, foundUser) {
			if (err) {
				res.redirect("back");
			} else {
				if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("/login");
	}
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function (err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				// does user own the comment?
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("/login");
	}
};

module.exports = middlewareObj;