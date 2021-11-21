const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require("dotenv").config({path:'.env'});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Database login
mongoose.connect(process.env.DB_key,
    {useNewUrlParser : true},()=>{console.log('successfully connected to database');
});

//User data API endpoints
const userRouter = require('./routes/User');
app.use('/user',userRouter);

//Spotify endpoints
const spotifyRouter = require('./routes/Fetch');
app.use('/fetch',spotifyRouter);

//Local server
app.listen(5000,()=>{
    console.log('express server started');
});