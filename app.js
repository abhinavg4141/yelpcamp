var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	port = process.env.PORT || 3000,
	flash = require("connect-flash"),
	// seedDB = require("./seeds"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	passportLocalMongoose = require("passport-local-mongoose");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb+srv://harshit:khushi01@cluster0-zzupi.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
});


// import pymongo
// import dns # required for connecting with SRV

// client = pymongo.MongoClient("mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test?w=majority")
// db = client.test


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIG===
app.use(require("express-session")({
	secret: "I am harshit",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=====
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000,function(){
	console.log("The Yelp Camp server has started!");
});
