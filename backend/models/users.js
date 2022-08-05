const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email' ],
        unique: true,
        lowercase: true,
        validate: [ val => {

        },'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password' ],
        minLength: [6, 'Min password length is 6 characters'],
    },
    lastcall: {
        type : Date
        //default: Date.now
    }
});
// fire after doc saved
userSchema.post('save',function(doc,next) {
    console.log('new user was created',doc);
    next();
})
// fire before doc saved
userSchema.pre('save', async function(next) {
    const salt =  await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('user about to be created ',this);

    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email: email});
    if(user) {
        const auth = await bcrypt.compare(password,user.password);
        if(auth) {
            return user;
        }
        throw Error('incorrect password');
    }   
    throw Error('Incorrect email');
}
const Users = mongoose.model("users", userSchema);
module.exports = Users;
