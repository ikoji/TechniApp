const express	= require("express"),
	app			= express(),
	bodyParser	= require("body-parser"),
	mongoose	= require("mongoose"),
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	// Job		= require("./models/job"),
	// Comment		= require("./models/comment"),
	User		= require("./models/user");

// Requiring Routes
const jobRoutes		= require("./routes/jobs"),
	  commentRoutes	= require("./routes/comments"),
	  indexRoutes	= require("./routes/index"),
	  userRoutes	= require("./routes/users");

const url = process.env.DATABASEURL || 'mongodb://localhost:27017/techniapp';
mongoose.connect(url, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"we'll be rockin",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/jobs", jobRoutes);
app.use("/jobs/:id/comments", commentRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("TechniApp Server is Online");
});