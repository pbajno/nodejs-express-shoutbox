const express = require('express');
const router = express.Router();
const dateformat = require('dateformat');

// Bring in all models
let Shout = require('../models/shout');
let User = require('../models/user');

// View all shouts
router.get('/shouts', function(req, res){
    Shout.find({},{},{sort: {date:-1}}, function(err, shouts){
        if(err){
            console.log(err);
        } else {
            res.render('shouts', {
                title: 'Latest shouts',
                shouts:shouts
            });
        }
    });
});

// Post new shout
router.post('/shout/add', ensureAuthenticated, function(req, res){
    
    const body = req.body.body;
    req.checkBody('body', 'Body is required').notEmpty();

    let errors = req.validationErrors();
    
    if (errors) {
        req.flash('danger', 'Body is requried');
        res.redirect('/');
    } else {
        let newShout = new Shout({
            body:body,
            user:req.user._id
        });
        newShout.save(function(err){
            if(err){
                console.log(err);
            } else {
                req.flash('success', 'Shout added');
                res.redirect('/');
            }
        });
    }

});

// Remove shout
router.delete('/shout/:id', ensureAuthenticated, function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }
    
    let query = {_id:req.params.id};
    
    Shout.findById(req.params.id, function(err, shout){
        if(shout.user != req.user._id) {
            res.status(500).send();
        } else {
            Shout.remove(query, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.send('Success');
                }
            });
        }
    });
});

// Get single shout
router.get('/shout/:id', function(req, res){
    Shout.findById(req.params.id, function(err, shout){
        User.findById(shout.user, function(err, user){
            if(err){
                console.log(err);
            } else {
                res.render('shout', {
                    shout: shout,
                    author: user.username
                });
            }
        });
    });
});

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/login');
    }
}

module.exports = router;