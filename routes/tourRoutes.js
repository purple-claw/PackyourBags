const express = require('express');
const router = express.Router();
const tourCon = require('./../controllers/tourControllers')

router
.route('/')
.get(tourCon.getAllTours)
.post(tourCon.createTour);

router
.route('/:id')
.get(tourCon.getTourByID)
.patch(tourCon.updateTour)
.delete(tourCon.deleteTour);

module.exports = router;

