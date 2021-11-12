const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb+srv://MasterKey:COP4331@largeproject.5yoav.mongodb.net/users?retryWrites=true&w=majority',
    {useNewUrlParser : true},()=>{console.log('successfully connected to database');
});

const userRouter = require('./routes/User');
app.use('/user',userRouter);




/*var request = require('request'); // "Request" library
var client_id = '114395066cda41339bf88ac498593f3b'; // Your client id
var client_secret = 'f983dc34a52542219c89ce6835278093'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
    });
  }
});


app.route('/spotify')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
})*/

app.listen(5000,()=>{
    console.log('express server started');
});