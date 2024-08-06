const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name : {
      type:String,
      required : true,
      unique : true
    },
    slug : {
      type : String
    },
    duration : {
      type : Number,
      required : true
    },
    maxGroupSize : {
      type : Number,
      required : true
    },
    difficulty : {
      type : String,
      required : true
    },
    ratingsAverage: {
      type : Number,
      default: 4.5
    },
    ratingsQuantity : {
      type : Number,
      default : 0
    },
    price : {
      type : Number,
      required: true,
    },
    discount : {
      type : Number,

    },
    summary : {
      type : String,
      trim : true
    },
    description : {
      type : String,
      required : true,
      trim : true
    },
    imageCover : {
      type : String,
      required : true
    },
    images : [String],
    createdAt : {
      type : Date,
      default : Date.now(),
      select : false
    },
    startDates : [Date]
  });
//DOCUMENT MIDDLEWARE
//tourSchema.pre('save', function(next) {
  //this.slug = slugify(this.name, {lower : true});
  //next();
//});

//tourSchema.pre('save', function(next) {
 // console.log("Will Saving Document!!!");
 // next();
//})

//tourSchema.post('save', function(doc,next) {
  //console.log(doc);
  //next();
//})

  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;