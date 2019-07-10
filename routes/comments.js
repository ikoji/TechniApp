var express = require("express"),
	router = express.Router({
		mergeParams: true
	}),
	Job = require("../models/job"),
	Comment = require("../models/comment"),
	middleware = require("../middleware");
const {
	check,
	validationResult
} = require('express-validator/check');

router.get("/new", middleware.isLoggedIn, newComment);
router.post("/", middleware.isLoggedIn,
	[
		check("comment[text]")
		.trim().escape()
		.not().isEmpty()
		.withMessage("Comment is empty")
		.isLength({
			max: 800
		}).withMessage("Too long. 800 characters max"),
	], createComment);
router.get("/:comment_id/edit", middleware.checkCommentOwnership, editComment);
router.put("/:comment_id", middleware.checkCommentOwnership,
	[
		check("comment[text]")
		.trim().escape()
		.not().isEmpty()
		.withMessage("Comment is empty")
		.isLength({
			max: 800
		}).withMessage("Comment is too long - 800 characters max"),
	], updateComment);
router.delete("/:comment_id", middleware.checkCommentOwnership, deleteComment);

module.exports = router;

// Comments New Route
function newComment(req, res) {
	// find job by id
	Job.findById(req.params.id, function (err, job) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {
				job: job
			});
		}
	});
}

// Comments Create Route
function createComment(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach(function (err) {
			req.flash("error", err.msg);
		});
		res.redirect("/jobs/" + req.params.id + "/comments/new");
	} else {
		// lookup job using ID
		Job.findById(req.params.id, function (err, job) {
			if (err) {
				console.log(err);
				res.redirect("/jobs");
			} else {
				// create new comment
				Comment.create(req.body.comment, function (err, comment) {
					if (err) {
						console.log(err);
					} else {
						// add username and id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.author.fullName = req.user.fullName;
						// connect new comment to job
						comment.save();
						job.modifiedAt = Date.now();
						job.comments.push(comment);
						job.save();
						// redirect to job show page
						req.flash("success", "Success! Comment added.");
						res.redirect("/jobs/" + job._id);
					}
				});
			}
		});
	}
}

// Comment Edit Route
function editComment(req, res) {
	Comment.findById(req.params.comment_id, function (err, foundComment) {
		if (err) {
			console.log(err);
		} else {
			Job.findById(req.params.id, function (err, foundJob) {
				if (err) {
					console.log(err);
				} else {
					res.render("comments/edit", {
						job_id: req.params.id,
						job: foundJob,
						comment: foundComment
					});
				}
			});
		}
	});
}

// Comment Update Route
function updateComment(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach(function (err) {
			req.flash("error", err.msg);
		});
		res.redirect("/jobs/" + req.params.id + "/comments/" + req.params.comment_id + "/edit");
	} else {
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
			if (err) {
				res.redirect("back");
			} else {
				Job.findByIdAndUpdate(req.params.id, req.body.job, function (err, updatedJob) {
					if (err) {
						res.redirect("back");
					} else {
						res.redirect("/jobs/" + req.params.id);
					}
				});
			}
		});
	}
}

// Comment Destroy Route
function deleteComment(req, res) {
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function (err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Success! Comment deleted.");
			res.redirect("/jobs/" + req.params.id);
		}
	});
}