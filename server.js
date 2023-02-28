require('dotenv').config({path: './config.env'});
const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes/User');

const cookieparser = require('cookie-parser');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001 ;

app.use(cookieparser());
app.use(express.json());



// Connect Database
connectDB();

//Routes
app.use('/api/auth', router);

app.listen(PORT, () =>
 console.log(`Server started on port ${PORT}`));


