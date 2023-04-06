const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const homeRoutes = require("./routes/home.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");
const donorRoutes = require("./routes/donor.js");
const agentRoutes = require("./routes/agent.js");
<<<<<<< HEAD
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/contact', (req, res) => {
  res.render('contact');
});
app.post('/contact', (req, res) => {
	const { name, email, message } = req.body;
  
	// Send email using Nodemailer
	const transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: "sherpasoni59@gmail.com",
        pass: "sqipreiwrqpdtldh",
	  },
	});
  
	const mailOptions = {
	  from: email,
	  to: 'sherpasoni59@gmail.com',
	  subject: 'New message from contact form',
	  text: `${name} (${email}) says: ${message}`,
	};
  
	transporter.sendMail(mailOptions, (error, info) => {
	  if (error) {
		console.log(error);
		res.send('Error sending message. Please try again later.');
	  } else {
		console.log('Email sent: ' + info.response);
		res.send('Message sent successfully!');
	  }
	});
  });
=======
const volunteerRoutes = require("./routes/volunteer.js");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', (req, res) => {
    const {name, email, message} = req.body;

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "sherpasoni59@gmail.com",
            pass: "sqipreiwrqpdtldh",
        },
    });

    const mailOptions = {
        from: email,
        to: 'sherpasoni59@gmail.com',
        subject: 'New message from contact form',
        text: `${name} (${email}) says: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Error sending message. Please try again later.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Message sent successfully!');
        }
    });
});
>>>>>>> a901489d0bf2d19844c8e122bfc6b491eb86e0bd

require("dotenv").config();
// require("./config/dbConnection.js")();
require("./config/passport.js")(passport);
const connectDB = require("./config/dbConnection");
<<<<<<< HEAD

connectDB();

=======
const User = require("./models/user");

connectDB();

// create a user

User.countDocuments({}, (err, count) => {
    if (err) {
        console.log(err);
    } else {
        if (count === 0) {
            const user = new User({
                firstName: "admin",
                lastName: "admin",
                email: "admin@gmail.com",
                password: bcrypt.hashSync("admin", 10),
                role: "admin",
                address: "kathmandu",
                phone: "9841234567",
                image: ''
            });
            user.save().then((res) => {
                console.log("User table seeded");
            }).catch((err) => {
                console.log(err);
            });
        }
    }
});

>>>>>>> a901489d0bf2d19844c8e122bfc6b491eb86e0bd

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use("/assets", express.static(__dirname + "/assets"));
<<<<<<< HEAD
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true
=======
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
>>>>>>> a901489d0bf2d19844c8e122bfc6b491eb86e0bd
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use((req, res, next) => {
<<<<<<< HEAD
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	next();
});



=======
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});


>>>>>>> a901489d0bf2d19844c8e122bfc6b491eb86e0bd
// Routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(donorRoutes);
app.use(adminRoutes);
app.use(agentRoutes);
<<<<<<< HEAD

  


app.use((req,res) => {
	res.status(404).render("404page", { title: "Page not found" });
=======
app.use(volunteerRoutes);


app.use((req, res) => {
    res.status(404).render("404page", {title: "Page not found"});
>>>>>>> a901489d0bf2d19844c8e122bfc6b491eb86e0bd
});


const port = process.env.PORT || 8100;
app.listen(port, console.log(`Server is running at http://localhost:${port}`));


