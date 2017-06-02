const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in models
let User = require('../models/user');
let Shout = require('../models/shout');

// User route
router.get('/user/:username', ensureAuthenticated, function(req, res){
    User.findOne({'username': req.params.username}, function(err, user){
        Shout.find({'user':user.id}, function(err, shouts){
            console.log(shouts);
            if(shouts[0]) {
                User.findById(user.id, function(err, user){
                    if(err){
                        console.log(err);
                    } else {
                        res.render('user', {
                            title: 'User1',
                            user: user,
                            shouts:shouts
                        });
                    }
                });
            } else {
                if(err){
                    console.log(err);
                } else {
                    res.render('user', {
                        title: 'User2',
                        user: user
                    });
                }
            }

        });

    });
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit POST Route
router.post('/profile', ensureAuthenticated, function(req, res){

  let updatedUser = {};
  updatedUser.name = req.body.name;
  updatedUser.email = req.body.email;
  updatedUser.city = req.body.city;

  let query = {_id:res.locals.loggedUser._id}

  User.update(query, updatedUser, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'User Updated');
      res.redirect('/profile');
    }
  });
});


// User route
router.get('/profile', ensureAuthenticated, function(req, res){
    User.findOne({'_id': res.locals.loggedUser._id}, function(err, loggedUser){
        if(err){
            console.log(err);
        } else {
            res.render('profile', {
                title: 'Profile',
                user: loggedUser
            });
        }
    });
});

// Users route
router.get('/users', ensureAuthenticated, function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        } else {
            res.render('users', {
                title: 'Users',
                users: users
            });
        }
    });
});

// Register user
router.get('/register', function(req, res){
    res.render('register', {
        title: 'Registration'
    })
});

// Register Form
router.post('/register', function(req, res){
    
    const name      = req.body.name;
    const username  = req.body.username;
    const email     = req.body.email;
    const password  = req.body.password;
    const password2 = req.body.password2;
    const city      = req.body.city;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('city', 'City is required').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            title: 'Registration',
            errors: errors
        });
    } else {
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password,
            city:city
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                    return;
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        req.flash('success','You are now registered and can log in');
                        res.redirect('/login');
                    }
                });
            });
        });

    }
});

// Login form
router.get('/login', function(req, res){
    res.render('login', {
        title: 'Login'
    });
});

// Login Process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You have been logged out.');
    res.redirect('/login');
})

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/login');
    }
}

module.exports = router;