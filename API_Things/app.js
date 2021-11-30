const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require("dotenv").config({path:'.env'});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "ShareTunes Spotify API",
        description: "SpotifyAPI Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: [
            {
                url:"http://localhost:5000",
                description: "Development Server",
            },
            {
                url:"http://localhost:5001",
                description: "Development Server",
            },
        ],
      }
    },
    apis: ["./routes/*.js"]
};

//Database login
mongoose.connect(process.env.DB_key,
    {useNewUrlParser : true, useFindAndModify: false},
    ()=>{console.log('successfully connected to database');
});

/*//User data API endpoints
const userRouter = require('./routes/User');
app.use('/user',userRouter);
*/

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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