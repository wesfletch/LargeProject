const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../schema/User');
const Playlist = require('../schema/Playlist');
const Validator = require("validator");
const sendEmail = require("../sendEmail");
const { request } = require('express');
const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const _ = require('underscore');
const authorized = passport.authenticate('jwt',{session : false})
require("dotenv").config({path:'../.env'});

const path = require('path');

const signToken = userID =>{
    return JWT.sign({
        iss : process.env.JWT_SECRET,
        sub : userID
    },process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRE});
}

//Registration endpint
router.post('/register',(req,res)=>{

    const {password, password2, display_name} = req.body;
    const email = req.body.email.toLowerCase()

    User.findOne({email},(err,user)=>{
        if(err){
            return res.status(500).json({message : {msgBody : "Error searching database.", msgError: err}});
        }
        //Checks if user is already registered
        if(user){
            return res.status(400).json({message : {msgBody : "Error: Email is already taken.", msgError: true}});
        }//Checks if email is valid
        if(!Validator.isEmail(email)){
            return res.status(401).json({message : {msgBody : "Error: Invalid email.", msgError: true}});
        }
        //Checks if password is a valid length
        if(!Validator.isLength(password, { min: 6, max: 30 })){
            return res.status(402).json({message : 
                {msgBody : "Error: Password must be between 6 and 30 characters.", msgError: true}});
        }
        //Confirms that both passwords match
        if(!Validator.equals(password,password2)){
            return res.status(403).json({message : {msgBody : "Error: Passwords must match.", msgError: true}});
        }
        if (!email || !password || !display_name) {
            return res.status(405).json({message : {msgBody : "Error: Please provide an email, name, and password.", msgError: true}});
        }
        else{  
            //creates verification Token 
            const verifyToken = crypto.randomBytes(20).toString(process.env.DIGEST);
            console.log(verifyToken);
            const verificationToken = crypto.createHash(process.env.HASH).update(verifyToken).digest(process.env.DIGEST);

            console.log("VerifyToken: " + verifyToken)
            console.log("verificationToken: " + verificationToken)

            //Saves the new user
            const newUser = new User({
                display_name: req.body.display_name,
                email: req.body.email,
                password: req.body.password,
                resetPasswordToken: verificationToken
            });
            newUser.save(async (err)=>{
                if(err){
                    return res.status(501).json({message : {msgBody : "Error saving to database.", msgError: err}});
                };
            });
  
            //Sends verification email
            try{
                //Create reset url to email to provided email
                const verifyUrl = `https://poosd-f2021-11.herokuapp.com/users/verify/?verifyToken=${verifyToken}`;

                // HTML Message
                const message = `
                <h1>Thank You For Joining ShareTunes!</h1>
                <p>We hope you enjoy discovering new music with us!</p>
                <p>Please use the following link to verify your email:</p>
                <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
                `;

                sendEmail({
                to: email,
                subject: "Welcome to ShareTunes!",
                text: message
                });
                console.log(newUser);

                return res.status(200).json({message : {msgBody : "User successfully saved. Verification email sent.", msgError: false}});
            }catch(err){
                console.log(err);
                return res.status(502).json({message : {msgBody : "Error: User saved. Email could not be sent.", msgError: err}});
            }
        }
    });
});

router.post('/login',async (req,res)=>{

    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    //Checks if email and password is provided
    if(!email || !password){
        res.status(400).json({message : {msgBody : "Error: Please provide an email and password.", msgError: true}});
    };

    User.findOne({email: req.body.email}, async(err,user)=>{ 
        if(err){
            return res.status(500).json({message : {msgBody : "Error searching the database.", msgError: err}});
        }
        if(!user){ //Checks if email is in database
            return res.status(404).json({message : {msgBody : "Invalid credentials", msgError: true}});
        }
        
        //Check that password match
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(404).json({message : {msgBody : "Error: Invalid credentials.", msgError: true}});
        }
        
        //Checks if user's email address is veified
        if(user.verificationToken == false){
            return res.status(402).json({message : {msgBody : "Error: Please verify your email before logging in.", msgError: true}});
        }
        
        const token = signToken(user._id);
        res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
        res.status(200).json({message : {msgBody : "Successfully logged in.", msgError: false}});
    });
});

//Logout endpoint, clears auth cookie
router.get('/logout', authorized ,(user,res)=>{
    res.clearCookie('access_token');
    return res.status(200).json({message : {msgBody : "Sucessfully logged out.", msgError: false}});
});

//Edit User Profile
router.put('/update', authorized,async(req,res)=>{

    //Updates the user's display name
    if(req.body.display_name){
        req.user.display_name = req.body.display_name;
    }

    //Updates the user's password
    if(req.body.password){
        //Checks if password is a valid length
        if(!Validator.isLength(req.body.password, { min: 6, max: 30 })){
            return res.status(402).json({message : 
                {msgBody : "Error: Password must be between 6 and 30 characters.", msgError: true}});
        }
        //Confirms that both passwords match
        if(!Validator.equals(req.body.password,req.body.password2)){
            return res.status(403).json({message : {msgBody : "Error: Passwords must match.", msgError: true}});
        }
        req.user.password = req.body.password;
    }

    //Updates the user's email
    if(req.body.email){
        const email = req.body.email.toLowerCase();
        var user = await User.findOne({email})

        console.log(user);
        //Checks if email is already in database.
        if(user){
            return res.status(400).json({message : {msgBody : "Error: Email is already taken.", msgError: true}});
        }
        //Checks if email is valid
        else if(!Validator.isEmail(email)){
            return res.status(401).json({message : {msgBody : "Error: Invalid email.", msgError: true}});
        }
        else{
            req.user.email = email;
        }
    }

    //Updates the user's image
    if(req.body.image){
        req.user.image = req.body.image;
    }
    
    //Updates the user's favorite artists
    if(req.body.fav_artists){
        req.user.fav_artists = req.body.fav_artists;
    }

    //Updates the user's favorite tracks
    if(req.body.fav_tracks){
        req.user.fav_tracks = req.body.fav_tracks;
    }

    //Updates the user's favorite genres
    if(req.body.fav_genres){
        req.user.fav_genres = req.body.fav_genres;
    }

    req.user.save(err=>{
        if(err)
            return res.status(502).json({message : {msgBody : "Error updating user's information.", msgError: err}});
        else
            return res.status(200).json({message : {msgBody : "Successfully updated user's information.", msgError: false}});
    });
});

//Forgot Password Endpoint
router.post('/forgot', async(req, res) => {
    //Takes In User's Email
    const email = req.body.email.toLowerCase();
  
    //Checks if email and password is provided
    if(!email){
        res.status(400).json({message : {msgBody : "Error: Please provide an email.", msgError: true}});
    };

    User.findOne({email}, async(err,user)=>{ 
        if(err){
            return res.status(501).json({message : {msgBody : "An Error Occured.", msgError: err}});
        }

        if (!user) {
            return res.status(400).json({message : {msgBody : "Error: Email could not be sent.", msgError: true}});
        }

        //Gets Reset Token
        const resetToken = user.getResetPasswordToken();

        await user.save();
  
        //Create reset url to email to provided email
        const resetUrl = `https://poosd-f2021-11.herokuapp.com/user/reset/${resetToken}`;
  
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

            return res.status(200).json({message : {msgBody : "Email successfully sent.", msgError: false}});

        }catch(err){
            console.log(err);
  
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
  
            await user.save();

            return res.status(500).json({message : {msgBody : "Error sending email.", msgError: err}});
        }
    })
});

//Reset Password Endpoint for Forgotten Passwords
router.put('/reset/:resetToken', async(req, res) => {
    //Compares token in URL params to hashed token
    const resetPasswordToken = crypto
    .createHash(process.env.HASH)
    .update(req.params.resetToken)
    .digest(process.env.DIGEST);

    await User.findOne({resetPasswordToken,resetPasswordExpire: {$gt: Date.now()}}, async(err,user)=>{
        if(err){
            return res.status(500).json({message : {msgBody : "Error: Unable to update password", msgError: err}});
        }
        if(!user){
            return res.status(400).json({message : {msgBody : "Error: Invalid Token.", msgError: "N/A"}});
        }
        //Confirms that both passwords match
        if(!Validator.equals(req.body.password,req.body.password2)){
            return res.status(401).json({message : {msgBody : "Error: Passwords must match.", msgError: "N/A"}});
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(200).json({message : {msgBody : "Password Successfully Updated.", resetToken: req.params.resetToken, msgError: "N/A"}});
    }).clone();  

});

// partial text search of User schema $text index
router.post('/search/users', authorized, (req, res) =>{
    const query = req.body.query;
    const limit = req.body.limit;
    var page = Math.max(0, req.body.page);

    User.aggregate([{$match: 
                    {$or:  [{display_name: new RegExp(query, 'i')}, 
                            {email: new RegExp(query, 'i')}]}}])
        .limit(limit)
        .skip(limit * page)
        .exec((err, users) => {
        if(err){
            console.log(err);
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        }else{
            console.log(users);
            res.status(200).json({users : users});
        }
    });
});

router.get('/verify/', async(req, res) => 
{
    //Compares token in URL params to hashed token
    const verificationToken = crypto
        .createHash(process.env.HASH)
        .update(req.query.verifyToken)
        .digest(process.env.DIGEST);

    console.log('verification' + req.query.verifyToken);
    console.log('verification' + verificationToken)

    try 
    {
        const user = await User.findOne({resetPasswordToken: verificationToken});

        if (!user) 
        {
            return res.status(400).json({message : {msgBody : "Error: Invalid Token.", msgError: true}});
        }

        user.verificationToken = true;
        user.resetPasswordToken = undefined;

        await user.save();
        // return res.status(200).json({message : {msgBody : "User's Email Successfully Verified.", msgError: false}});
        const message = `
        <h1>Email Verified!</h1>
        `;

        console.log(path.resolve(__dirname, '../Webclient', 'frontend', 'build', 'index.html'));
        res.sendFile(path.resolve(__dirname, '../Webclient', 'frontend', 'build', 'index.html'));
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).json({message : {msgBody : "Error: Unable to verify user.", msgError: err}});
    }
});

//Verify Email Endpoint
router.put('/verify/:verifyToken', async(req, res) => {
    //Compares token in URL params to hashed token
    const verificationToken= crypto
    .createHash(process.env.HASH)
    .update(req.params.verifyToken)
    .digest(process.env.DIGEST);
    
    await User.findOne({resetPasswordToken: verificationToken}, async(err,user)=>{
        if(err){
            return res.status(500).json({message : {msgBody : "Error: Unable to verify user.", msgError: err}});
        }
        if(!user){
            return res.status(400).json({message : {msgBody : "Error: Invalid Token.", msgError: true}});
        }

        user.verificationToken = true;
        user.resetPasswordToken = undefined;

        await user.save();
        return res.status(200).json({message : {msgBody : "User's Email Successfully Verified.", token: req.params.verifyToken, msgError: false}});
    }).clone()

});

router.put('/verifytoken', async(req, res) => {

    console.log(req.body.verifyToken)
    //Compares token in URL params to hashed token
    const verificationToken= crypto
    .createHash(process.env.HASH)
    .update(req.body.verifyToken)
    .digest(process.env.DIGEST);
    
    await User.findOne({resetPasswordToken: verificationToken}, async(err,user)=>{
        if(err){
            return res.status(500).json({message : {msgBody : "Error: Unable to verify user.", msgError: err}});
        }
        if(!user){
            return res.status(400).json({message : {msgBody : "Error: Invalid Token.", msgError: true}});
        }

        user.verificationToken = true;
        user.resetPasswordToken = undefined;

        await user.save();
        return res.status(200).json({message : {msgBody : "User's Email Successfully Verified.", msgError: false}});
    }).clone()

});

// Resend verification email
router.put('/verify', async(req, res) => {

    //Takes In User's Email
    const email = req.body.email.toLowerCase();

    if(!email){
        return res.status(401).json({message : {msgBody : "Error: Please provide an email address.", msgError: true}});
    }
  
    await User.findOne({email}, async(err,user)=>{
        if(err){
            return res.status(501).json({message : {msgBody : "Error setting verification.", msgError: err}});
        }
        
        if(!user){
            return res.status(400).json({message : {msgBody : "Error: Invalid email.", msgError: true}});
        }

        //Gets verify Token
        const verifyToken = crypto.randomBytes(20).toString(process.env.DIGEST);
        const verificationToken = crypto.createHash(process.env.HASH).update(verifyToken).digest(process.env.DIGEST);

        user.resetPasswordToken = verificationToken;
        await user.save();

        // Creates verify url to email to provided email
        const verifyUrl = `https://poosd-f2021-11.herokuapp.com/users/verify/${verifyToken}`;
                
        // HTML Message
        const message = `
            <h1>Thank you for signing up with ShareTunes!</h1>
            <p>Please use the following link to verify your email:</p>
            <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
        `;

        try
        {
            await sendEmail({
                to: email,
                subject: "ShareTunes Email Verification",
                text: message,
            });

                return res.status(200).json({message : {msgBody : "Email successfully sent.", msgError: false}});


        }
        catch(err){
            return res.status(500).json({message : {msgBody : "Error sending email.", msgError: err}});
        }
    }).clone();
});
     

/*---------------------------------------------------*/
//                   Friend APIs
/*---------------------------------------------------*/

//Add friend
router.post('/add', authorized, async(req,res)=>{
    req.body.email = req.body.email.toLowerCase()
    User.findOne({email: req.body.email}, function(err,doc) { 
        if(err){
            return res.status(500).json({message : {msgBody : "Error finding friend.", msgError: err}});
        }
        if(!doc){ //Checks if email is in database
            return res.status(404).json({message : {msgBody : "Error: User not found.", msgError: true}});
        }
        if(doc){ //Checks if friend already exists in friend's list
            if(req.user.friends.indexOf(doc.id.toString()) === -1) {
                User.findByIdAndUpdate({_id:req.user._id},{$push:{friends : doc._id}})
                .then(() =>User.findByIdAndUpdate(doc._id,{$push:{friends : req.user.id}}))
                .then(() => res.status(200).json({message : {msgBody : "Successfully  added friend.", msgError: false}}))
                .catch(err => res.status(501).json({message : {msgBody : "Error adding friend.", msgError: err}}));
            }
            else{
                //Else friend already exists in friend's list
                return res.status(401).json({message : {msgBody : "Error: User is already your friend.", msgError: true}});
            }
        }
    });
});

//Get all friends
router.get('/friends', authorized,async(req,res)=>{
    User.findById({_id : req.user._id}).populate('friends',{resetPasswordToken: 0,
        resetPasswordExpire: 0, password:0, verificationToken:0, date:0, __v:0}).exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error fetching friend.", msgError: err}});
        else{
            document.friends = _.sortBy( document.friends, 'display_name' );
            res.status(200).json({friends : document.friends});
        }
    });
});

//Delete Friend 
//Gets email through url path
router.delete('/friend/:email', authorized, (req,res) =>{
    User.findOne({email: req.params.email}, function(err,doc) { 
        if(err){
            return res.status(500).json({message : {msgBody : "Error finding friend.", msgError: err}});
        }
        if(!doc){ //Checks if email is in database
            return res.status(404).json({message : {msgBody : "Error: User not found.", msgError: true}});
        }
        if(doc){ //Checks if friend exists in user's friend's list
            if(req.user.friends.indexOf(doc.id.toString()) === -1) {
                //Friend does not exist in user's friend list.
                return res.status(401).json({message : {msgBody : "Error: User is not your friend.", msgError: true}});
            }
            else{
                //Else friend does exist in user's friend's list
                User.findOneAndUpdate({_id: req.user._id}, {$pull: {friends: doc.id}})
                .then(() => res.status(200).json({message : {msgBody : "Friend successfully deleted.", msgError: false}}))
                .catch(err => res.status(501).json({message : {msgBody : "Error deleting friend.", msgError: err}}));
            }
        }
    });
});
       
/*---------------------------------------------------*/
//                   Playlistd APIs
/*---------------------------------------------------*/

//OLD Add Playlist
router.post('/addplaylist', authorized, async(req,res) =>{
    const playlist = new Playlist({
        name : req.body.name,
        songs : req.body.songs,
        user : req.user.id,
    });

    playlist.save(err => 
    {
        if(err)
            res.status(500).json({message : {msgBody : "Error adding playlist.", msgError: true}});
        else{
            req.user.playlists.push(playlist);
            req.user.save(err =>
            {
                if(err)
                    res.status(501).json({message : {msgBody : "Error saving playlist.", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created paylist.", msgError: false}});
            });
        }
    })
});

// Get user's playlists (minus songs)
router.get('/playlists', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    User.findById({_id : req.user._id})
        .populate('playlists', 'name friend')
        .exec((err,document) => 
    {
        if (err)
        {
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        }
        else
        {
            res.status(200).json({playlists : document.playlists, authenticated : true});
        }
    });
});

// Get full playlist (plus songs)
router.get('/playlist/:id', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    Playlist.findById({_id : req.params.id})
            .populate('songs')
            .exec((err, playlist) =>
    {
        if (err)
        {
            return res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        }
        else 
        {
            return res.status(200).json({playlist : playlist, authenticated: true});
        }
    });

});

//Delete a playlist
router.delete('/playlist/:id', authorized,(req,res)=>{
    Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Playlist.", msgError: false}}))
    .catch(err => res.status(500).json({message : {msgBody : "Error deleting playlist.", msgError: err}}));
});

//Edit Playlist
router.put('/playlist/:id', authorized,(req,res)=>{
    Playlist.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Updated Playlist.", msgError: false}}))
    .catch(err => res.status(500).json({message : {msgBody : "Error updated playlist.", msgError: err}}));
});

// Get full playlist (plus songs)
router.get('/playlist/:id', authorized, (req,res) => {
    Playlist.findById({_id : req.params.id})
            .populate('songs')
            .exec((err, playlist) =>{
        if(err){
            return res.status(500).json({message : {msgBody : "Error has occured", msgError: err}});
        }else{
            return res.status(200).json({playlist : playlist, authenticated: true});
        }
    });
});

//-------------------------New Playlist APIs-----------------------------//

//Add PlaylistV2
//Adds tracks with all the same information outputed by the get-recommendations API
//You can now push the output recommendations directly into a playlist
router.post('/addplaylistv2', authorized, async (req,res)=>{
    const playlist = await new Playlist({name: req.body.name});
    req.body.tracks.forEach(async(track,i) => {
        await playlist.tracks.push(track)
    });
    console.log(playlist)
    playlist.save(err=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error adding playlist.", msgError: err}});
        else{
            req.user.playlists.push(playlist);
            req.user.save(err=>{
                if(err)
                    res.status(502).json({message : {msgBody : "Error saving playlist.", msgError: err}});
                else
                res.status(200).json({message : {msgBody : "Successfully created paylist.", msgError: false}});
            });
        }
    })
});

//Delete a track from a playlist
router.delete('/deltrack/:playlist_id/:track_id', authorized,async(req,res)=>{

    const _id = req.params.playlist_id;
    const t_id = req.params.track_id;
    console.log(_id);

    try{
        const playlist = await Playlist.findById(_id);
        console.log(playlist)
        if(!playlist){
            return res.status(400).json({message : {msgBody : "Error: Could not locate playlist.", msgError: true}});
        }
        if(!playlist.tracks.id(t_id)){
            return res.status(401).json({message : {msgBody : "Error: Could not locate track to delete.", msgError: true}});
        }

        playlist.tracks.pull({_id: t_id})
        playlist.save(err =>{
            if(err)
                return res.status(500).json({message : {msgBody : "Error saving playlist.", msgError: err}});
        })

        return res.status(200).json({message : {msgBody : "Sucessfully Deleted Song.", msgError: false}});
    }
    catch(err){
        if(err){
            return res.status(501).json({message : {msgBody : "Error deleting song.", msgError: err}});
        }
    }
});

//Add a track to a playlist
router.put('/addtrack', authorized,async(req,res)=>{
    const _id = req.body.playlist_id;
    console.log(_id);

    try{
        const playlist = await Playlist.findById(_id);
        if(!playlist){
            return res.status(400).json({message : {msgBody : "Error: Could not locate playlist.", msgError: true}});
        }

        var count = 0;
        req.body.tracks.forEach(async(track,i) => {
            if(playlist.tracks.id(track._id)){
                count++;
                return
            }
            await playlist.tracks.push(track)
        });

        playlist.save(err =>{
            if(err)
                return res.status(500).json({message : {msgBody : "Error saving playlist.", msgError: err}});
        })

        if(count=0){
            return res.status(200).json({message : {msgBody : "Sucessfully Added Song/s.", msgError: false}});
        }
        else{
            return res.status(200).json({message : {msgBody : "Playlist sucessfully updated. Some songs were duplicates and not added.", msgError: false}});
        }
    }
    catch(err){
        if(err){
            return res.status(501).json({message : {msgBody : "Error adding song/s.", msgError: err}});
        }
    }
});
      
/*---------------------------------------------------*/
//                   Profile API
/*---------------------------------------------------*/

//Returns user's favorite tracks, songs, and genres
router.get('/getfavs/', authorized, (req,res) =>{
    
    try{
        var userFavorites ={ 
            "fav_artists": req.user.fav_artists,
            "fav_genres": req.user.fav_genres,
            "fav_tracks": req.user.fav_tracks
        };
        return res.status(200).json(userFavorites)
    }catch(err){
        if(err){
            return res.status(500).json({message : {msgBody : "Error getting user's favorites", msgError: err}})
        }
    }
})

// add fav_track (given valid Spotify track ID)
router.put('/fav_track/:id', authorized, (req,res) =>
{
    User.findByIdAndUpdate({_id : req.user.id}, {$push: {fav_tracks : req.params.id}})
        .then(() => res.status(200).json({message : {msgBody : "Successfully added fav_track", msgError : false}}))
        .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// remove fav_track (given valid Spotify track ID)
router.delete('/fav_track/:id', authorized, (req,res) =>
{
    User.updateOne({_id : req.user.id}, {$pullAll: { fav_tracks : [req.params.id] } }, (err, user) =>
    {
        if (err)
        {
            return res.status(500).json({message : {msgBody : "Could not find remove fav_track", msgError: true}});
        }
        else 
        {
            return res.status(200).json({message : {msgBody : "Successfully removed fav_track", msgError: false}});
        }
    });

});

// add fav_genre (given valid Spotify genre)
router.put('/fav_genre/:genre', authorized, (req,res) =>
{
    User.findByIdAndUpdate({_id : req.user.id}, {$push: {fav_genres : req.params.genre}})
        .then(() => res.status(200).json({message : {msgBody : "Successfully added fav_genre", msgError : false}}))
        .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// remove fav_genre (given valid Spotify genre string)
router.delete('/fav_genre/:id', authorized, (req,res) =>
{
    User.updateOne({_id : req.user.id}, {$pullAll: { fav_genres : [req.params.id] } }, (err, user) =>
    {
        if (err)
        {
            return res.status(500).json({message : {msgBody : "Could not find remove fav_genre", msgError: true}});
        }
        else 
        {
            return res.status(200).json({message : {msgBody : "Successfully removed fav_genre", msgError: false}});
        }
    });

});

// add fav_artist (given valid Spotify artist ID)
router.put('/fav_artist/:artist', authorized, (req,res) =>
{
    User.findByIdAndUpdate({_id : req.user.id}, {$push: {fav_artists : req.params.artist}})
        .then(() => res.status(200).json({message : {msgBody : "Successfully added fav_artist", msgError : false}}))
        .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// remove fav_artist (given valid Spotify artist ID)
router.delete('/fav_artist/:id', authorized, (req,res) =>
{
    User.updateOne({_id : req.user.id}, {$pullAll: { fav_artists : [req.params.id] } }, (err, user) =>
    {
        if (err)
        {
            return res.status(500).json({message : {msgBody : "Could not find remove fav_artist", msgError: true}});
        }
        else 
        {
            return res.status(200).json({message : {msgBody : "Successfully removed fav_artist", msgError: false}});
        }
    });
});
     

/*---------------------------------------------------*/
//       Authentication API for Frontend
/*---------------------------------------------------*/

router.get('/authenticated',authorized,(req,res)=>{
    const {display_name} = req.user;
    res.status(200).json({isAuthenticated : true, user : {display_name}});
});

module.exports = router;
