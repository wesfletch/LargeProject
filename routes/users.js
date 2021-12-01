const router = require("express").Router();
const passport = require('passport');
const passportConfig = require('../passport');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");

const User = require("../schema/User.js");
const Friend = require("../schema/Friend.js");
const Playlist = require("../schema/Playlist.js");

const Validator = require("validator");
const sendEmail = require("../sendEmail");

// Loading validators
// const validateRegisterInput = require("../Validation/register");
// const validateLoginInput = require("../Validation/login");

const signToken = userID =>{
    return JWT.sign({
        iss : process.env.JWT_SECRET,
        sub : userID
    }, process.env.JWT_SECRET, {expiresIn : "1h"});
}

/*---------------------------------------------------*/
//             Login/Registration APIs
/*---------------------------------------------------*/

router.post('/register', (req,res) =>
{    
    const {password, password2, display_name} = req.body;
    const email = req.body.email.toLowerCase();

    console.log(req.body);

    User.findOne({ email }, (err,user) => 
    {
        if (err)
        {
            res.status(500).json({message : {msgBody : "Error searching database", msgError: err}});
        }
        // check if email is already registered to a user    
        else if (user)
        {
            res.status(400).json({message : {msgBody : "Email is already taken", msgError: true}});
        }
        //Checks if email is valid
        else if(!Validator.isEmail(email))
        {
            return res.status(401).json({message : {msgBody : "Error: Invalid email.", msgError: true}});
        }
        //Checks if password is a valid length
        else if(!Validator.isLength(password, { min: 6, max: 30 }))
        {
            return res.status(402).json({message : 
                {msgBody : "Error: Password must be between 6 and 30 characters.", msgError: true}});
        }
        //Confirms that both passwords match
        else if(!Validator.equals(password, password2))
        {
            return res.status(403).json({message : {msgBody : "Error: Passwords must match.", msgError: true}});
        }
        // ensures all required fields are provided
        else if (!email || !password || !display_name) {
            return res.status(405).json({message : {msgBody : "Error: Please provide an email, display_name, and password.", msgError: true}});
        }
        // if all of the checks pass, create the new user and attempt to send welcome email
        else
        {
            const newUser = new User({
                display_name: req.body.display_name,
                email: req.body.email,
                password: req.body.password, 
            });
            newUser.save(err => 
            {
                if(err)
                    res.status(500).json({message : {msgBody : "Error saving to database", msgError: true}});

                const message = `
                <h1>Welcome to ShareTunes!</h1>
                <p>Thank you for joining our site. We hope you enjoy discovering new music with us!</p>
                `;
                
                // Sends registration email
                try {
                    sendEmail({
                    to: req.body.email,
                    subject: "Welcome to ShareTunes!",
                    text: message,
                    });

                    return res.status(201).json({message : {msgBody : "User successfully saved.", msgError: false}});
                }
                catch (err) 
                {
                    return res.status(501).json({message : {msgBody : "Error: User saved. Email could not be sent.", msgError: true}});
                }
            });
        }
    });
});

router.post('/login', passport.authenticate('local', {session : false}), (req,res) => 
{
    // Form validation; ensure we've been given all necessary info
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) 
    {
        return res.status(400).json(errors);
    }

    if (req.isAuthenticated())
    {
       const {_id,email} = req.user;
       const token = signToken(_id);
       res.cookie('access_token', token, {httpOnly: true, sameSite:true}); 
       res.status(200).json({isAuthenticated : true, user : {email}, token: token});
    }
});

router.get('/logout', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    res.clearCookie('access_token');
    res.status(200).json({user:{email : ""},success : true});
});

// partial text search of User schema $text index
router.post('/search/users', passport.authenticate('jwt', {session : false}), (req, res) =>
{
    const query = req.body.query;
    const limit = req.body.limit;
    var page = Math.max(0, req.body.page);

    User.aggregate([{$match: 
                    {$or:  [{display_name: new RegExp(query, 'i')}, 
                            {email: new RegExp(query, 'i')}]}}])
        .limit(limit)
        .skip(limit * page)
        .exec((err, users) =>
    {
        if(err)
        {
            console.log(err);
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});

        }
        else
        {
            console.log(users);
            res.status(200).json({users : users});
        }
    });

});

/*---------------------------------------------------*/
//                   Friend APIs
/*---------------------------------------------------*/

// Add friend
router.post('/friend', passport.authenticate('jwt', {session : false}) ,(req,res) => 
{
    const friend = new Friend(req.body);

    friend.save(err => 
    {
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else
        {
            req.user.friends.push(friend);
            req.user.save(err => 
            {
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created Friend", msgError : false}});
            });
        }
    })
});

// Get all friends
router.get('/friends', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    User.findById({_id : req.user._id}).populate('friends').exec((err,document) => 
    {
        if(err)
        {
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        }
        else 
        {
            res.status(200).json({friends : document.friends, authenticated : true});
        }
    });
});

// Edit Friend Fields
router.put('/friend/:id', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    Friend.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Edited Friend", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// Delete Friend
router.delete('/friend/:id', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    Friend.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Friend", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

/*---------------------------------------------------*/
//                   Playlist APIs
/*---------------------------------------------------*/
// Add Playlist
router.post('/playlist', passport.authenticate('jwt', {session : false}), (req,res) =>
{
    const playlist = new Playlist(req.body);
    playlist.user = req.user.id;    // add user ID to new playlist

    playlist.save(err => 
    {
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else
        {
            req.user.playlists.push(playlist);
            req.user.save(err =>
            {
                if(err)
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                else
                    res.status(200).json({message : {msgBody : "Successfully created a Playlist", msgError : false}});
            });
        }
    })
});

// Get user's playlists
router.get('/playlists', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    User.findById({_id : req.user._id}).populate('playlists').exec((err,document) => 
    {
        if(err)
        {
            console.log(err);
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        }
        else
        {
            res.status(200).json({playlists : document.playlists, authenticated : true});
        }
    });
});

// Edit Playlist
router.put('/playlist/:id', passport.authenticate('jwt',{session : false}),(req,res) => 
{
    Playlist.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Updated Playlist!", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// Delete Playlist
router.delete('/playlist/:id', passport.authenticate('jwt',{session : false}),(req,res)=>{
    Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Playlist", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

/*---------------------------------------------------*/
//                   Authenticated API
/*---------------------------------------------------*/

router.get('/authenticated', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    const {email} = req.user;
    res.status(200).json({isAuthenticated : true, user : {email}});
});

module.exports = router;
