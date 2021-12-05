const router = require("express").Router();
const passport = require('passport');
const passportConfig = require('../passport');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

const User = require("../schema/User.js");
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
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    //Checks if email and password is provided
    if (!email || !password) {
        res.status(400).json({message : {msgBody : "Error: Please provide an email and password.", msgError : true}});
    }

    // Authorizes user by sending auth cookie
    // sends token with response
    if (req.isAuthenticated())
    {
       const {_id,email} = req.user;
       const token = signToken(_id);
       res.cookie('access_token', token, {httpOnly: true, sameSite: true}); 
       res.status(200).json({isAuthenticated : true, user : {email}, token: token});
    }
});

router.get('/logout', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    res.clearCookie('access_token');
    res.status(200).json({user:{email : ""},success : true});
});

// Forgot Password Endpoint
router.post('/forgot', async(req, res) => 
{
    // Takes In User's Email
    const email = req.body.email.toLowerCase();
  
    try 
    { 
        // Checks if user exists
        const user = await User.findOne({ email });

        if (!user) 
        {
            return res.status(400).json({message : {msgBody : "Error: user with given email could not be found.", msgError: true}});
        }

        // Gets Reset Token
        const resetToken = user.getResetPasswordToken();

        await user.save();

        // TODO: this needs to become an actual URL
        // Create reset url to email to provided email
        const resetUrl = `http://localhost:5000/passwordreset/${resetToken}`;

        // HTML Message
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please use the following link to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            `;

        try
        {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({message : {msgBody : "Email successfully sent.", msgError: false}});
        }
        catch(err)
        {
            console.log(err);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            res.status(500).json({message : {msgBody : "Error sending email.", msgError: err}});
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(501).json({message : {msgBody : "An error occurred.", msgError: err}});
    }
});

// Reset Password Endpoint
router.put('/reset/:resetToken', async(req, res) => 
{
    // Compares token in URL params to hashed token
    const resetPasswordToken = crypto
        .createHash(process.env.HASH)
        .update(req.params.resetToken)
        .digest(process.env.DIGEST);

    try 
    {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({message : {msgBody : "Error: Invalid Token.", msgError: true}});
        }
        // Confirms that both passwords match
        if(!Validator.equals(req.body.password,req.body.password2)){
            return res.status(401).json({message : {msgBody : "Error: Passwords must match.", msgError: true}});
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return res.status(200).json({message : {msgBody : "Password Successfully Updated.", msgError: false}});
    } 
    catch (err) 
    {
        return res.status(500).json({message : {msgBody : "Error: Unable to update password", msgError: err}});
    }

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
router.post('/add/', passport.authenticate('jwt',{session : false}),async(req,res) =>
{
    User.findOne({email: req.body.email}, function(err,doc) 
    { 
        if(err)
        {
            return res.status(500).json({message : {msgBody : "Error finding friend.", msgError: true}});
        }
        // Checks if email is in database
        if(!doc)
        { 
            return res.status(402).json({message : {msgBody : "Error: User not found.", msgError: true}});
        }
        // Checks if friend already exists in friend's list
        if(doc)
        { 
            if(req.user.friends.indexOf(doc.id.toString()) === -1) 
            {
                User.findByIdAndUpdate({_id:req.user._id},{$push:{friends : doc._id}})
                .then(() =>User.findByIdAndUpdate(doc._id,{$push:{friends : req.user.id}}))
                .then(() => res.status(200).json({message : {msgBody : "Successfully  added friend.", msgError: false}}))
                .catch(err => res.status(501).json({message : {msgBody : "Error adding friend.", msgError: true}}));
            }
            else
            {
                // Else friend already exists in friend's list
                return res.status(401).json({message : {msgBody : "Error: User is already your friend.", msgError: true}});
            }
        }
    });
});

// Get all friends
router.get('/friends', passport.authenticate('jwt', {session : false}), (req,res) => 
{
    User.findById({_id : req.user._id})
        .populate('friends', 'display_name email fav_genres fav_artists fav_tracks friends playlists')
        .exec((err,document) => 
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

// Delete Friend
router.delete('/friend/:email', passport.authenticate('jwt',{session : false}), (req,res) =>
{
    User.findOne({email : req.params.email}, (err, friend) => 
    {
        if (err)
        {
            console.log(err);
            return res.status(501).json({message : {msgBody : "Could not find user with given email.", msgError: true}});
        }
        else
        {
            User.findOneAndUpdate({_id: req.user._id}, {$pull: {friends: friend._id}})
                .then(() => res.status(200).json({message : {msgBody : "Friend successfully deleted.", msgError: false}}))
                .catch(err => 
                {
                    console.log(err);
                    res.status(500).json({message : {msgBody : "Error deleting friend.", msgError: true}})
                });
        }
    });
});

/*---------------------------------------------------*/
//                   Playlist APIs
/*---------------------------------------------------*/
// Add Playlist
router.post('/addplaylist', passport.authenticate('jwt', {session : false}), (req,res) =>
{
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

// Edit Playlist
router.put('/playlist/:id', passport.authenticate('jwt',{session : false}), (req,res) => 
{
    Playlist.findByIdAndUpdate(req.params.id,{$set: req.body})
    .then(() => res.status(200).json({message : {msgBody : "Successfully Updated Playlist!", msgError : false}}))
    .catch(err => es.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// Delete Playlist
router.delete('/playlist/:id', passport.authenticate('jwt', {session : false}), (req,res) =>
{
    // remove the playlist from the users playlists array
    User.updateOne({_id : req.user.id}, {$pullAll: { playlists : [req.params.id] } }, (err, user) =>
    {
        if (err)
        {
            console.log(err);
            return res.status(500).json({message : {msgBody : "Could not find playlist for User", msgError: true}});
        }
        else 
        {
            // delete the playlist from Playlists DB
    Playlist.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({message : {msgBody : "Successfully Deleted Playlist", msgError : false}}))
                .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));

        }
    });

});

/*---------------------------------------------------*/
//                   Profile API
/*---------------------------------------------------*/

// add fav_track (given valid Spotify track ID)
router.put('/fav_track/:id', passport.authenticate('jwt', {session : false}), (req,res) =>
{
    User.findByIdAndUpdate({_id : req.user.id}, {$push: {fav_tracks : req.params.id}})
        .then(() => res.status(200).json({message : {msgBody : "Successfully added fav_track", msgError : false}}))
        .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// add fav_genre (given valid Spotify genre)
router.put('/fav_genre/:genre', passport.authenticate('jwt', {session : false}), (req,res) =>
{
    User.findByIdAndUpdate({_id : req.user.id}, {$push: {fav_genres : req.params.genre}})
        .then(() => res.status(200).json({message : {msgBody : "Successfully added fav_genre", msgError : false}}))
        .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
});

// add fav_artist (given valid Spotify artist ID)
router.put('/fav_artist/:artist', passport.authenticate('jwt', {session : false}), (req,res) =>
{
    User.findByIdAndUpdate({_id : req.user.id}, {$push: {fav_artists : req.params.artist}})
        .then(() => res.status(200).json({message : {msgBody : "Successfully added fav_artist", msgError : false}}))
        .catch(err => res.status(500).json({message : {msgBody : "Error has occured", msgError: true}}));
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
