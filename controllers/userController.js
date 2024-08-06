const fs = require('fs');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = catchAsync(async (req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        status : "Success",
        message : "Fetched User Succesfully",
        data : {
            users
        }
    });
});

exports.createUsers = (req,res) => {
    res.status(500).json({
        status : 'Internal Server error',
        message : 'Route Yet Not Implemented'
    });
};

exports.getUserById = (req,res) => {
    res.status(500).json({
        status : 'Internal Server error',
        message : 'Route Yet Not Implemented'
    });
};

exports.updateUser = (req,res) => {
    res.status(500).json({
        status : 'Internal Server error',
        message : 'Route Yet Not Implemented'
    });
};

exports.deleteUser = (req,res) => {
    res.status(500).json({
        status : 'Internal Server error',
        message : 'Route Yet Not Implemented',
        data : null
    });
};
