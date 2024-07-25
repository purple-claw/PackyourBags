const fs = require('fs');
const Tour = require('../models/tourModel');

exports.checkBody = (req,res,next) => {
    if (!req.body.name || req.body.price) {
        return res.status(400).json({
            status : 'fail',
            message : 'Missing Name and Price!'
        });
    }
    next();
};

exports.getAllTours = async (req,res) => {
    try {
        //Filtering
        console.log(req.query);
        const queryObj = { ...req.query };
        const excludedFields = ['page','sort','limit','fields']
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced Filtering
        let querystr = JSON.stringify(queryObj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query =  Tour.find(JSON.parse(querystr));

        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        
        }else{
            query = query.sort('-createdAt');
        }

        //Feild limiting
        if (req.query.fields){
            const feildstr = req.query.fields.split(',').join(' ');
            query = query.select(feildstr);
        }else {
            query = query.select('-__v');
        }

        // Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        //Execute Query
        const tours = await query;

        res.status(200).json({
            status:'success',
            data : {
                tours : tours
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status : "fail",
            message : err
        });
    };
};

exports.createTour = async (req,res) => {
    try {
        const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'Success',
        message : "Tour Created Sucesfully",
        data : {
            tour : newTour
        }
    });
    } catch (err) {
        res.status(400).json({
            status : 'fail',
            message : err
        });
    };
};

exports.getTourByID = async (req,res) => {
    try {
        const tourin = await Tour.findById(req.params.id);
        res.status(200).json({
            status : 'Success!',
            message : "Fetched Succesfully",
            data : {
                tourin
            }
        });
    } catch (err) {
        res.status(401).json({
            status : 'fail',
            message : err
        });
    };
};

exports.updateTour = async (req,res) => {
    try {
        const uptour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new : true, 
            runValidators:true
        });
        res.status(200).json({
            status : "Success",
            message : "Updated Tours",
            data : uptour
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message : err
        });
    }
};

exports.deleteTour = async (req,res) => {
    try {
        const dltour = await Tour.findOneAndDelete(req.params.id);
        res.status(200).json({
            status : "Sucess",
            message : "Data Deleted Succesfully",
            data : null
        });
    } catch (err) {
        res.status(400).json({
            message : err
        });
    };
};