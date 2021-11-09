const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
// const auth = require("../middleware/auth");
const User = require("../schema/user-schema.js");

// login
router.post('/login', async (req, res, next) => 
{
    // incoming : email, password(?)
    // outgoing : id, display_name, spotify_uri, access_token, refresh_token

    var error = '';

    // TODO: not sure how passwords are meant to be handled
    const { email } = req.body;

    const results = await User.find({ email: email });

    var ID = -1;
    var displayName = '';
    var spotifyURI = '';
    var access = '';
    var refresh = '';

    if ( results.length > 0)
    {
        console.log(results);
        ID              = results[0].ID;
        displayName     = results[0].display_name;
        spotifyURI      = results[0].spotify_uri;
        access          = results[0].access_token;
        refresh         = results[0].refresh_token;
    }

    var ret = { id:ID, display_name:displayName, spotify_uri:spotifyURI, access_token:access, refresh_token:refresh }
    
    res.status(200).json(ret);
});


// register
router.post("/register", async (req, res) => 
{
    // incoming: email, password, passwordCheck (password twice for verification)
    // outgoing: 

    try 
    {
        let { email, password, passwordCheck } = req.body;

        console.log(req.body);

        // throw error if user (email) exists already
        const existingUser = await User.findOne({ email: email});
        if (existingUser)
        {
            return res.status(400).json({ msg: "Account with this email already exists."});
        }

        // throw error if passwords don't match
        // might be better handled on the frontend side
        if (password != passwordCheck)
        {
            return res.status(400).json({ msg: "Passwords don't match."})
        }

        // encrypt password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            email: email,
            // password: passwordHash,
        });

        // attempt to save new user to database
        const savedUser = await newUser.save();
        res.json(savedUser);
    
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }

});






















module.exports = router;