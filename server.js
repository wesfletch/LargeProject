const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const passport = require("passport");
const app = express();
require("dotenv").config({path:'.env'});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//----------------Swagger Things-------------------
YAML = require('yamljs')
const swaggerUi=require('swagger-ui-express');
const swaggerJsDoc = YAML.load('./swagger.yaml')
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
//--------------------------------------------------

//Enable Cors
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

// Passport middleware
app.use(passport.initialize());

//Database login
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Mongo DB connected"))
.catch(err => console.log(err))

//User data API endpoints
app.use("/users", require("./routes/users"));

//Spotify endpoints
app.use("/fetch", require("./routes/fetch"))

//Local server
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
    app.use(express.static('Webclient/frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'Webclient', 'frontend', 'build', 'index.html'));
    });
}