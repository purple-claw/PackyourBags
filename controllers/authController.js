const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppErr = require('./../utils/appError');
const errCon = require('./../controllers/errorController')

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

exports.protect = catchAsync(async (req,res,next) => {
    //1. Getting the Token
    let token;
    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token){
        return next(new AppErr('You are not Logged IN', 401))
    }

    //2. Verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3. Check if User Still Exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppErr('This User Belongs to the Token No Longer exists!!', 401));
    }

    //4. Check if the user recently changed password
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppErr("User Recently Changed The Password!, Please Log in Again", 401)
        );
    };
    
    //Grant Access to Protected Route
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        // Roles is an Array
        if(!roles.includes(req.user.role)) {
            return next(new AppErr('You do not have access to Perform this Action', 401))
        }
    }
    next();
}