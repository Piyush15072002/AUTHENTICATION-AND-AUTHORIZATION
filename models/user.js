const mongoose = require('mongoose');

// one of our three passport packages
const passportLocalMongoose = require('passport-local-mongoose');


// creating our user schema

const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: [true, 'Enter a valid email'],
        unique: true
    }
});

// we do not have to define schema for 'username' and 'passpord'
// they are added authomatically by the passportJs
// but remember to use the below command

userSchema.plugin(passportLocalMongoose);
// plugging in our passport-local-mongoose to the userschema to add username and password

// when we use passport, we do not need to use bcrypt to hash password and add salts
// it does it automatically for us 
// it even make sure that username is unique
// that's why we use it !

// creating our model with User being a new collection in database and userSchema is the schema 
const User = mongoose.model('User', userSchema);


// exporting 
module.exports = User;