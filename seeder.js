 var seeder = require('mongoose-seed');
 
// Connect to MongoDB via Mongoose 
seeder.connect('mongodb://localhost/mean', function() {
 
    // Load Mongoose models 
    seeder.loadModels([
        'models/user.js',
        'models/shout.js'
    ]);
 
    // Clear specified collections 
    seeder.clearModels(['User', 'Shout'], function() {
 
        // Callback to populate DB once collections have been cleared 
        seeder.populateModels(users, function() {
            //seeder.disconnect(); 
        });
 
        seeder.populateModels(shouts, function() {
            //seeder.disconnect(); 
        });

    });
});
 
// Data array containing seed data - documents organized by Model
// Nothing here yet
var users = [
    {
        'model': 'User',
        'documents': [ ]
    }
];

var shouts = [
    {
        'model': 'Shout',
        'documents': [ ]
    }
];