const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Validator = require("validator");
const sendEmail = require("../sendEmail");
const { request } = require('express');
const mongoose = require('mongoose');
const crypto = require("crypto");
const authorized = passport.authenticate('jwt',{session : false})
require("dotenv").config({path:'../.env'});

const signToken = userID =>{
    return JWT.sign({
        iss : process.env.JWT_SECRET,
        sub : userID
    },process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRE});
}

//Registration endpint
userRouter.post('/register',(req,res)=>{

    const {password, password2, name} = req.body;
    const email = req.body.email.toLowerCase()

    User.findOne({email},(err,user)=>{
        if(err){
            return res.status(500).json({message : {msgBody : "Error searching database.", msgError: err}});
        }
        //Checks if user is already registered
        if(user){
            return res.status(400).json({message : {msgBody : "Error: Email is already taken.", msgError: "N/A"}});
        }//Checks if email is valid
        if(!Validator.isEmail(email)){
            return res.status(400).json({message : {msgBody : "Error: Invalid email.", msgError: "N/A"}});
        }
        //Checks if password is a valid length
        if(!Validator.isLength(password, { min: 6, max: 30 })){
            return res.status(400).json({message : 
                {msgBody : "Error: Password must be between 6 and 30 characters.", msgError: "N/A"}});
        }
        //Confirms that both passwords match
        if(!Validator.equals(password,password2)){
            return res.status(400).json({message : {msgBody : "Error: Passwords must match.", msgError: "N/A"}});
        }
        if (!email || !password || !name) {
            return res.status(400).json({message : {msgBody : "Error: Please provide an email, name, and password.", msgError: "N/A"}});
        }
        else{   //Saves the new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            newUser.save(err=>{
                if(err)
                    return res.status(500).json({message : {msgBody : "Error saving to database.", msgError: err}});
                else{

                    // HTML Message
                    const message = `
                    <h1>Welcome to ShareTunes!</h1>
                    <p>Thank you for joining our site. We hope you enjoy discovering new music with us!</p>
                    `;
                    
                    //Sends registration email
                    try {
                        sendEmail({
                        to: req.body.email,
                        subject: "Welcome to ShareTunes!",
                        text: message,
                        });

                       return res.status(200).json({message : {msgBody : "User successfully saved.", msgError: false}});
                    }catch (err) {
                        return res.status(500).json({message : {msgBody : "Error: User saved. Email could not be sent.", msgError: true}});
                    }
                }    
            });
        }
    });
});

//Login endpoint
userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{

    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    //Checks if email and password is provided
    if (!email || !password) {
        res.status(400).json({message : {msgBody : "Error: Please provide an email and password.", msgError: "N/A"}});
    }
   
    //Authorizes user by sending auth cookie
    if(req.isAuthenticated()){
        const {_id,email} = req.user;
        const token = signToken(_id);
        res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
        res.status(200).json({message : {msgBody : "Successfully logged in.", msgError: "N/A"}});
    }
});

//Logout endpoint, clears auth cookie
userRouter.get('/logout', authorized ,(user,res)=>{
    res.clearCookie('access_token');
    res.json({user:{email : ""},success : true});
});

//Edit User Profile
userRouter.put('/update/:id', authorized,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Edited User.", msgError: "N/A"}}))
    .catch(err => res.status(500).json({message : {msgBody : "Error editing user.", msgError: er}}));
});

//Forgot Password Endpoint
userRouter.post('/forgot', async(req, res) => {
    //Takes In User's Email
    const email = req.body.email.toLowerCase();
  
    try { //Checks if user exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({message : {msgBody : "Error: Email could not be sent.", msgError: "N/A"}});
      }
  
      //Gets Reset Token
      const resetToken = user.getResetPasswordToken();
  
      await user.save();
  
      //Create reset url to email to provided email
      const resetUrl = `http://localhost:5000/passwordreset/${resetToken}`;
  
      // HTML Message
      const message = `
        <h1>You have requested a password reset</h1>
        <p>Please use the following link to reset your password:</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;
  
      try{
        await sendEmail({
          to: user.email,
          subject: "Password Reset Request",
          text: message,
        });

        res.status(200).json({message : {msgBody : "Email successfully sent.", msgError: "N/A"}});

      }catch(err){
        console.log(err);
  
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
  
        await user.save();

        res.status(500).json({message : {msgBody : "Error sending email.", msgError: err}});
      }
    } catch (err) {
      return res.status(500).json({message : {msgBody : "An Error Occured.", msgError: err}});
    }
});

//Reset Password Endpoint
userRouter.put('/reset/:resetToken', async(req, res) => {
    //Compares token in URL params to hashed token
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

    try {
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400).json({message : {msgBody : "Error: Invalid Token.", msgError: "N/A"}});
    }
    //Confirms that both passwords match
    if(!Validator.equals(req.body.password,req.body.password2)){
        return res.status(400).json({message : {msgBody : "Error: Passwords must match.", msgError: "N/A"}});
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({message : {msgBody : "Password Successfully Updated.", msgError: "N/A"}});
    } catch (err) {
        res.status(500).json({message : {msgBody : "Error: Unable to update password", msgError: err}});
    }

});


/*---------------------------------------------------*/
//                   Friend APIs
/*---------------------------------------------------*/

//Add friend
userRouter.post('/add/', passport.authenticate('jwt',{session : false}),async(req,res)=>{
    User.findOne({email: req.body.email}, function(err,doc) { 
        if(err){
            return res.status(500).json({message : {msgBody : "Error finding friend.", msgError: err}});
        }
        if(!doc){ //Checks if email is in database
            return res.status(400).json({message : {msgBody : "Error: User not found.", msgError: "N/A"}});
        }
        if(doc){ //Checks if friend already exists in friend's list
            if(req.user.friends.indexOf(doc.id.toString()) === -1) {
                User.findByIdAndUpdate({_id:req.user._id},{$push:{friends : doc._id}})
                .then(() =>User.findByIdAndUpdate(doc._id,{$push:{friends : req.user.id}}))
                .then(() => res.status(200).json({message : {msgBody : "Successfully  added friend.", msgError: "N/A"}}))
                .catch(err => res.status(500).json({message : {msgBody : "Error adding friend.", msgError: err}}));
            }
            else{
                //Else friend already exists in friend's list
                return res.status(400).json({message : {msgBody : "Error: User is already your friend.", msgError: "N/A"}});
            }
        }
    });
});

//Get all friends
userRouter.get('/friends', authorized,async(req,res)=>{
    User.findById({_id : req.user._id}).populate('friends').exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error fetching friend.", msgError: err}});
        else{
            res.status(200).json({friends : document.friends});
        }
    });
});


//Delete Friend
userRouter.delete('/friend/:id', authorized,(req,res)=>{
    User.findOneAndUpdate({_id: req.user._id}, {$pull: {friends: req.params.id}})
    .then(() => res.status(200).json({message : {msgBody : "Friend successfully deleted.", msgError: "N/A"}}))
    .catch(err => res.status(500).json({message : {msgBody : "Error deleting friend.", msgError: err}}));
});

/*---------------------------------------------------*/
//                   Playlistd APIs
/*---------------------------------------------------*/

//Add Playlist
userRouter.post('/addplaylist', authorized ,(req,res)=>{
    const playlist = new Playlist({name:req.body.name, tracks: req.body.tracks});
    playlist.save(err=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error adding playlist.", msgError: err}});
        else{
            req.user.playlists.push(playlist);
            req.user.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error saving playlist.", msgError: err}});
                else
                res.status(200).json({message : {msgBody : "Successfully created paylist.", msgError: "N/a"}});
            });
        }
    })
});

//Get user's playlists
userRouter.get('/playlists', authorized,(req,res)=>{
    User.findById({_id : req.user._id}).populate('playlists').exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error fetching playlists.", msgError: err}});
        else{
            res.status(200).json({playlists : document.playlists});
        }
    });
});

//Edit Playlist
userRouter.put('/playlist/:id', authorized,(req,res)=>{
    Playlist.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Updated Playlist.", msgError: "N/A"}}))
    .catch(err => res.status(500).json({message : {msgBody : "Error updated playlist.", msgError: err}}));
});

//Delete Playlist
userRouter.delete('/playlist/:id', authorized,(req,res)=>{
    Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Playlist.", msgError: "N/A"}}))
    .catch(err => res.status(500).json({message : {msgBody : "Error deleting playlist.", msgError: err}}));
});

module.exports = userRouter;
