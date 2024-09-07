const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please tell us your Name']
    },
    email : {
        type : String,
        required : [true, 'Please specify Your Email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'PLease Provide Valid Email!']
    },
    photo :{
        String
    },
    role : {
        type : String,
        enum : ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true,'Please Provide a Password'],
        minlength : 8,
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please Confirm Your Password'],
        //Works only on Create and Save
        validate : {
            validator: function(el) {
                return el === this.password;
            },
            message : 'Passwords are not the same!'
        }
    },
    passwordChangedAt : Date
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTtimestamp) {
    if(this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    }
    return false;
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;