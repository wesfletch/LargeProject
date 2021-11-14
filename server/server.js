const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require("passport");
const app = express();

app.use(cors());
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded());

require('dotenv').config({path: '../.env'});

// enable CORS, 
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});

///////////////////////////////////////////////////
// For Heroku deployment
// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
    // Set static folder
    app.use(express.static('frontend/build'));app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Passport middleware
app.use(passport.initialize());

const url = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(url)
    .then(() => console.log("Mongo DB connected"))
    .catch(err => console.log(err));

// add the /users router (/routes/User.js)
app.use("/users", require("./routes/users"));