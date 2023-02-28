require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');

const connectDb = async() => {

    try
    {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        
        });
        console.log('MongoDB Connected');
    }
    catch(err)
    {
        console.log(err.message)
    }
}

module.exports = connectDb; 