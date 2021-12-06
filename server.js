const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require("passport");
const app = express();

app.use(cors({
    credentials: true, origin: 'http://poosd-f2021-11.herokuapp.com' 
}));
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded());

require('dotenv').config({path: './.env'});

// enable CORS, 
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', 'http://poosd-f2021-11.herokuapp.com');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});

// Passport middleware
app.use(passport.initialize());

const url = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(url)
    .then(() => console.log("Mongo DB connected"))
    .catch(err => console.log(err));

// add the /users router (/routes/users.js)
app.use("/users", require("./routes/users"));

// add the /fetch router (/routes/fetch.js)
app.use("/fetch", require("./routes/fetch"))

///////////////////////////////////////////////////
// For Heroku deployment
// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
    // Set static folder
    app.use(express.static('Webclient/frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'Webclient', 'frontend', 'build', 'index.html'));
    });
}