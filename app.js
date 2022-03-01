if (process.env.NODE_ENV === 'development') {   // if in development mode then require dotenv
    require('dotenv').config();
}

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');

const path = require('path');

const db = process.env.DB || 'mongodb://localhost:27017/authPassport'
mongoose.connect(db)
const connection = mongoose.connection
connection.on('error', () => {
    console.log('Sorry cannot connect to database :-(');
})
connection.once('open', () => {
    console.log('Connected to database ');
});

// secret 
const secret = process.env.SECRET;

// SETS and USE

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
app.get('/index', (req, res) => {
    res.render('index');
});

// login 
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    res.send(req.body);
});

// register
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    res.send(req.body)
});


// error page not found
app.all('*', (req, res) => {
    res.render('error');
});


// listening at port 
PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Listening...')
});
