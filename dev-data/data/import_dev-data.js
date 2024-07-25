const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

dotenv.config({ path : './config.env' });

const DB = 'mongodb+srv://dev:dev1234@node.9lkn7j5.mongodb.net/Natours?retryWrites=true&w=majority&appName=Node'
mongoose.connect(DB)
.then((con) => {
  console.log("Database Connected Succesfully");
})
.catch(err=>{
  console.log("Error connectoimng to DataBase")
});

// Reading from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Importing Data
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data Loaded Succesfully");
    }catch (err) {
        console.log(err);
    };
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Deleted data SuccessFully");
    }catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import'){
    importData()
}else if (process.argv[2] === '--delete'){
    deleteData()
};

console.log(process.argv);