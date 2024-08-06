const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppErr = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req,res,next) => {
    const newuser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });
    //Signing the JWT Token
    const token = signToken(newuser._id);
    res.status(200).json({
        status : "Success",
        token : token,
        message : "User Created Succesfully",
        data : newuser
    });
});

exports.login = catchAsync(async (req,res,next) => {
    const { email, password } = req.body;
    //check email and password
    if (!email || !password) {
        return next(new AppErr(`Please Provide Valid Email and Password`, 404));
    }
    //Check email
    const user = await User.findOne({ email }).select('+password');
    
    //Check Password
    const correct = await user.correctPassword(password, user.password);
    if (!user || !correct) {
        return next(new AppErr(`Invalid Credentials`, 401));
    }
    const token = signToken(user._id);
    res.status(200).json({
        status : "Success",
        token : token,
    })
});