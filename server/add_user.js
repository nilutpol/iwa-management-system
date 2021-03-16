const mongoose = require('mongoose');
const _ = require('lodash');
const fs = require('fs');
const generatePassword = require('password-generator');
const { DateTime } = require('luxon');

const User = require('./Models/User');

// this is our MongoDB database
const dbRoute = 'mongodb+srv://nilutpol:Sh5nqMnWxODumGvT@cluster0.6okv3.mongodb.net/iwa-loom-management-system';

// connects our back end code with the database
mongoose.connect(dbRoute, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

let db = mongoose.connection;

let users = [
    {
        "username": "nilutpol"
    }
]

users = _.map(users, (val, idx) => {
    val.password = generatePassword(6, false, /\d/);
    val.user_access = 'user';
    return val;
})

db.once('open', () => {
    console.log('connected to the database.');

    // Add Users
    _.each(users, async i => {
        let u = new User(i);
        await u.save();
    })

    fs.writeFileSync('Users.json', JSON.stringify(users, null, '\t'));
    console.log('Done.')
});

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));