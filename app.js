if (process.env.NODE_ENV !== 'production') {  // if we are not in production mode means we are in development mode then
    require('dotenv').config();
}

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');

const path = require('path');

// session to store user login info and to use with passport   -- remember to use it before passport
const session = require('express-session');

// our user model
const User = require('./models/user');

// our isLoggedIn middleware
const isLoggedIn = require('./middlewares/isLoggedIn');

const db = process.env.DB || 'mongodb://localhost:27017/authPassport'
mongoose.connect(db)
const connection = mongoose.connection
connection.on('error', () => {
    console.log('Sorry cannot connect to database :-(');
})
connection.once('open', () => {
    console.log('Connected to database ');
});


// using our session before passport 

const sessionConfig = {
    secret: process.env.SECRET,
    resave: false, //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //Forces a session that is "uninitialized" to be saved to the store
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,    // in miliseconds
        secure: false, // make it true when in production 
    }

};

app.use(session(sessionConfig));


// importing passport and passport-local

const passport = require('passport');
const localStrategy = require('passport-local');

// using our passport

// step 1 - initialize the passport - Let it take control
app.use(passport.initialize());

// step 2 - now we will use passport session to store user login info
app.use(passport.session());
//* note - make sure to import 'express-session' and USE SESSION BEFORE USING PASSPORT 

// step 3 - now we will create a new strategy for our model using passport
passport.use(new localStrategy(User.authenticate()));

// passport provides us with some of the functions like authenticate(), serializeUser(), deserializeUser(), etc
// so we are basically saying - hey passport, create a new strategy for our User model for authentication

// step 4 - now we since we did authentication, now we will serializeUser ie. kinda like logging in
passport.serializeUser(User.serializeUser()); // storing user info in session ( log in )

// step 5 - now since the user is logged in, we have to have a way to log out as well
passport.deserializeUser(User.deserializeUser());

// step 6 - use the register() function by passport to register a new user ( go to post route of register to see)

// step 7 - now we will use our passport.authenticate() method in our login post routes 

// step 8 - now to keep user login info, we will use passport function called isAuthenticated() in our isLoggedIn middleware

// step 9 - logging out a user using req.logout() by passport

// step 10 - req.user is added to req object by passport which stores the information about the currently logged in user
//           now we will create a global variable called currentUser that store user info and use it to show and hide the login/logout buttons

app.use((req, res, next) => {
    res.locals.currentUser = req.user;

    // since it a middleware so moving next
    next();
});

// to parse the req body
app.use(express.urlencoded({ extended: true }));

// setting views folder to serve files from its absolute path
app.set('views', path.join(__dirname, 'views'));

// view engine to be ejs
app.set('view engine', 'ejs');

// using ejs-mate to create boilerplate
app.engine('ejs', ejsMate);


// relative - app.use(express.static('public'));
// absolute
app.use('/static', express.static(path.join(__dirname, 'public')));




// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

// index page - only authenticated can access
app.get('/index', isLoggedIn, (req, res) => {   // protecting our route by middleware
    res.render('index');
});


// register
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {

    // destructuring from the req body
    const { username, email, password } = req.body;

    // creating a new user
    //* DO NOT PUT PASSWORD WHILE CREATING A NEW USER BECAUSE WE WILL USE REGISTER() METHOD BY PASSPORT
    //* REGISTER()- HASHES & SALTS THE PASSWORD AND CHECKS IF USERNAME IS UNIQUE OR NOT
    const user = new User({ username, email });

    // using the register method 
    const newUser = await User.register(user, password);  // hashing & salting password and storing in the database

    // user is successfully registered and now redirecting to home
    res.redirect('/');

});



// login 
app.get('/login', (req, res) => {
    res.render('login');
});

// step 7 - now we will passport.authenticate() to check if the user is authenticated or not ie check username and password
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {

    // if the compiler comes here means that the user is authenticated and now we can send him to home
    res.redirect('/');
});

// logout
app.post('/logout', (req, res) => { // we can even do with get request
    req.logout();   // by passport
    res.redirect('/')
})

// error page not found
app.all('*', (req, res) => {
    res.render('error');
});


// listening at port 
PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Listening...')
});
