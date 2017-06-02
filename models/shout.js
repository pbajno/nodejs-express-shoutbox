let mongoose = require('mongoose');

// shout Schema
let shoutSchema = mongoose.Schema({
    body:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    },
    lat:{
        type: Boolean,
        required: false
    },
    lng:{
        type: Boolean,
        required: false
    },
    user:{
        type: String,
        ref: true
    }
});

let shout = module.exports = mongoose.model('Shout', shoutSchema);