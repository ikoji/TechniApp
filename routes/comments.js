var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Job     = require("../models/job"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// Comments New Route
router.get("/new", middleware.isLoggedIn, function(req, res){
	// find job by id
	Job.findById(req.params.id, function(err, job){
	   if(err){
		   console.log(err);
	   } else {
		   res.render("comments/new", {job: job});
	   }
	});
});

// Comments Create Route
router.post("/", middleware.isLoggedIn, function(req, res){
   // lookup job using ID
   Job.findById(req.params.id, function(err, job) {
	   if(err){
		   console.log(err);
		   res.redirect("/jobs");
	   } else {
		   // create new comment
		   Comment.create(req.body.comment, function(err, comment){
			   if(err){
				   console.log(err);
			   } else {
			        // add username and id to comment
			        comment.author.id = req.user._id;
			        comment.author.username = req.user.username;
					// connect new comment to job
					comment.save();
					job.comments.push(comment);
					job.save();
					// redirect to job show page
					req.flash("success", "Success! Comment added.");
					res.redirect("/jobs/" + job._id);
			   }
		   });
	   }
   });
});

// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment) {
	    if(err){
	    	console.log(err);
	    } else {
	    	Job.findById(req.params.id, function(err, foundJob) {
	    	    if(err){
	    	    	console.log(err);
	    	    } else {
	    	    	res.render("comments/edit", {job_id: req.params.id, job: foundJob, comment: foundComment});
	    	    }
	    	});
	    }
	});
});

// Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err){
			res.redirect("back");
		} else {
			Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJob){
				if(err){
					res.redirect("back");
				} else {
					res.redirect("/jobs/" + req.params.id );
				}
			});
		}
	});
});

// Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Success! Comment deleted.");
			res.redirect("/jobs/" + req.params.id);
		}
	});
});

module.exports = router;