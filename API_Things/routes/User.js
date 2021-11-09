const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Friend = require('../models/Friend');
const Playlist = require('../models/Playlist');

// Loading validators
const validateRegisterInput = require("../Validation/register");
const validateLoginInput = require("../Validation/login");

const signToken = userID =>{
    return JWT.sign({
        iss : "SecretCop",
        sub : userID
    },"SecretCop",{expiresIn : "1h"});
}

userRouter.post('/register',(req,res)=>{
    //Validation Check
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
    return res.status(400).json(errors);
    }
    
    const {email, password} = req.body;
    User.findOne({email, password},(err,user)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error searching database", msgError: true}});
        if(user)
            res.status(400).json({message : {msgBody : "Email is already taken", msgError: true}});
        else{
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
           });
            newUser.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error saving to database", msgError: true}});
                else
                    res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
            });
        }
    });
});

userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
    //Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
    return res.status(400).json(errors);
    }

    if(req.isAuthenticated()){
       const {_id,email} = req.user;
       const token = signToken(_id);
       res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
       res.status(200).json({isAuthenticated : true,user : {email}});
    }
});

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
    res.clearCookie('access_token');
    res.json({user:{email : ""},success : true});
});

/*---------------------------------------------------*/
//                   Friend APIs
/*---------------------------------------------------*/

//Add friend
userRouter.post('/friend', passport.authenticate('jwt',{session : false}) ,(req,res)=>{
    const friend = new Friend(req.body);

    friend.save(err=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            req.user.friends.push(friend);
            req.user.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created Friend", msgError : false}});
            });
        }
    })
});

//Get all friends
userRouter.get('/friends', passport.authenticate('jwt',{session : false}),(req,res)=>{
    User.findById({_id : req.user._id}).populate('friends').exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            res.status(200).json({friends : document.friends, authenticated : true});
        }
    });
});

//Edit Friend Name
userRouter.put('/friend/:id', passport.authenticate('jwt',{session : false}),(req,res)=>{
    Friend.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Edited Friend", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

//Delete Friend
userRouter.delete('/friend/:id', passport.authenticate('jwt',{session : false}),(req,res)=>{
    Friend.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Friend", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

/*---------------------------------------------------*/
//                   Playlistd APIs
/*---------------------------------------------------*/

//Add Playlist
userRouter.post('/playlist', passport.authenticate('jwt',{session : false}) ,(req,res)=>{
    const playlist = new Playlist(req.body);
    playlist.save(err=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            req.user.playlists.push(playlist);
            req.user.save(err=>{
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created a Playlist", msgError : false}});
            });
        }
    })
});

//Get user's playlists
userRouter.get('/playlists', passport.authenticate('jwt',{session : false}),(req,res)=>{
    User.findById({_id : req.user._id}).populate('playlists').exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            res.status(200).json({playlists : document.playlists, authenticated : true});
        }
    });
});

//Edit Playlist
userRouter.put('/playlist/:id', passport.authenticate('jwt',{session : false}),(req,res)=>{
    Playlist.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Updated Playlist!", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

//Delete Playlist
userRouter.delete('/playlist/:id', passport.authenticate('jwt',{session : false}),(req,res)=>{
    Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Playlist", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

//Share Playlist with friend
    //I need to implement this


/*---------------------------------------------------*/
//                   Authenticated API
/*---------------------------------------------------*/

userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {email} = req.user;
    res.status(200).json({isAuthenticated : true, user : {email}});
});

/*---------------------------------------------------*/
//                   Spotify API
/*---------------------------------------------------*/



module.exports = userRouter;