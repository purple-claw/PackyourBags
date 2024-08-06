const fs = require('fs');
const Tour = require('../models/tourModel');
const apiFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

exports.checkBody = (req,res,next) => {
    if (!req.body.name || req.body.price) {
        return res.status(400).json({
            status : 'fail',
            message : 'Missing Name and Price!'
        });
    }
    next();
};

exports.getAllTours = catchAsync(async (req,res,next) => {
    // EXECUTE QUERY
    const features = new apiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;
    //SEND RESPONSE
    res.status(200).json({
        status:'success',
        data : {
            tours : tours
        }
    });
});

exports.createTour = catchAsync(async (req,res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'Success',
        message : "Tour Created Sucesfully",
        data : {
            tour : newTour
        }
    });
});

exports.getTourByID = catchAsync(async (req,res,next) => {
    const tourin = await Tour.findById(req.params.id);
    if (!tourin) {
        return next(new AppError('No Tour found With that ID', 404));
    }
    res.status(200).json({
        status : 'Success',
        message : "Fetched Tour Succesfully",
        data : {
            tour : tourin
        }
    });
});

exports.updateTour = catchAsync(async (req,res,next) => {
    const uptour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new : true, 
        runValidators:true
    });
    if (!uptour) {
        return next(new AppError('No Tour found With that ID', 404));
    }
    res.status(200).json({
        status : "Success",
        message : "Updated Tours",
        data : uptour
    });
});

exports.deleteTour = catchAsync(async (req,res,next) => {
    const dltour = await Tour.findOneAndDelete(req.params.id);
    if (!dltour) {
        return next(new AppError('No Tour found With that ID', 404));
    }
        res.status(200).json({
            status : "Sucess",
            message : "Data Deleted Succesfully",
            data : null
        });
});

exports.getTourStats = catchAsync(async (req,res,next) => {
    const stats = await Tour.aggregate([
        {
            $match : { ratingsAverage : { $gte : 4.5} }
        },
        {
            $group : {
                _id : '$difficulty',
                numTours : { $sum : 1 },
                numratings : { $sum : '$ratingsQuantity'},
                avgrating : {$avg : '$ratingsAverage'},
                avgprice : {$avg : '$price'},
                minprice : {$min : '$price'},
                maxprice : {$max : '$price'}
            }
        },
        {
            $sort : { avgprice : 1}
        }
    ]);
    res.status(200).json({
        status : "Success",
        data : {
            stat : stats
        }
    });
});

exports.getMontlyPlan = catchAsync(async (req,res,next) => {
    const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates'
            },
            {
                $match : {
                    startDates : {
                        $gte : new Date(`${year}-01-01`),
                        $lte : new Date(`${year}-12-31`) 
                    }
                }
            },
            {
                $group : {
                    _id : {
                        $month : '$startDates'
                    },
                    numOfTours : { $sum : 1},
                    tours : { $push : '$name'}
                }
            },
            {
                $addFields : { month : '$_id'}
            },
            {
                $project : {
                    _id : 0
                }
            },
            {
                $sort : {numOfTours : -1}
            },
            {
                $sort : {month : 1}
            }
        ]);
        res.status(200).json({
            status : "success",
            data : {
                plan : plan
            }
        })
});