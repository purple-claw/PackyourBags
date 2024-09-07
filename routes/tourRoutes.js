const express = require('express');
const router = express.Router();
const tourCon = require('./../controllers/tourControllers')
const authCon = require('./../controllers/authController');

router.route('/tour-stats').get(tourCon.getTourStats);
router.route('/monthly-plan/:year').get(tourCon.getMontlyPlan);

router
.route('/')
.get(authCon.protect, tourCon.getAllTours)
.post(tourCon.createTour);

router
.route('/:id')
.get(tourCon.getTourByID)
.patch(tourCon.updateTour)
.delete(authCon.protect, 
    authCon.restrictTo('admin','lead-guide'),
    tourCon.deleteTour);

module.exports = router;

