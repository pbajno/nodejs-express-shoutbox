const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const dateformat = require('dateformat');

//const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function(err){
    console.log(err);
});

// Init app
const app  = express();
app.locals.moment = require('moment');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Bring in User model
let Shout = require('./models/shout');

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
    secret: 'keyboard dog',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    console.log(res.locals.messages);
    next();
});

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' +namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value :value
        };
    }
}));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){

    var ms;
    ms = req.session.cookie.expires - new Date();
    ms = 1000*Math.round(ms/1000);
    
    var expiresIn = new Date(ms);
    //console.log(expiresIn.getUTCMinutes() + ':' + expiresIn.getUTCSeconds() );
    res.locals.expiresIn  = expiresIn.getUTCMinutes() + 'min';
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.loggedUser = req.user;
    next();
});

// Home route
app.get('/', function(req, res){
    Shout.find({},{},{sort: {date:-1}}, function(err, shouts){
        if(err){
            console.log(err);
        } else {
            res.render('index', {
                title: 'Dashboard',
                shouts:shouts
            });
        }
    });
});

// Route Files
let shouts = require('./routes/shouts');
let users = require('./routes/users');
app.use(shouts);
app.use(users);


// Start server
app.listen(3000, function(){
    console.log('Server started on port 3000');
});