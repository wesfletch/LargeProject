const router = require("express").Router();
const passport = require('passport');
const passportConfig = require('../passport');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");

const User = require("../schema/User.js");
const Friend = require("../schema/Friend.js");
const Playlist = require("../schema/Playlist.js");

// Loading validators
const validateRegisterInput = require("../Validation/register");
const validateLoginInput = require("../Validation/login");

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
    // Validation Check
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    const {email, password} = req.body;
    User.findOne({ email }, (err,user) => 
    {
        if(err)
            res.status(500).json({message : {msgBody : "Error searching database", msgError: true}});
        if(user)
        {
            res.status(400).json({message : {msgBody : "Email is already taken", msgError: true}});
        }
        else
        {
            const newUser = new User(req.body);
            console.log(user);
            newUser.save(err => 
            {
                if(err)
                    res.status(500).json({message : {msgBody : "Error saving to database", msgError: true}});
                else
                    res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
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
