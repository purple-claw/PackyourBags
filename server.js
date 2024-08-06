const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env'});

const DB = process.env.DATABASE
mongoose.connect(DB)
.then((con) => {
  console.log("Database Connected Succesfully");
})
.catch(err=>{
  console.log("Error connectoimng to DataBase")
  console.log(err)
});

const port = 3000;
app.listen(port,() => {
    console.log("App listening on Port 3000!");
});
