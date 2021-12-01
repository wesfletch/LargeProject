const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const reqString = {
    type: String, 
    required: true
}

const User = mongoose.Schema({
    country: String,
    display_name: String,
    email: String,
    spotify_uri: String,
    link: String,
    ID: String,
    password: String,
    profile_image: String,
    product: String,
    type: String,
    access_token: String,
    refresh_token: String,
    top_music: Array,
    top_artists: Array,
    friends : [{type : mongoose.Schema.Types.ObjectId, ref: 'Friend'}],
    playlists : [{type : mongoose.Schema.Types.ObjectId, ref: 'Playlist'}],
    resetPasswordToken: String,
    resetPasswordExpire: Date
})
User.index({display_name: 'text', email: 'text'});

// for password encryption
User.pre('save', function(next)
{
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10,(err,passwordHash) => 
    {
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

User.methods.comparePassword = function(password,cb) 
{
    // no need to hash our password beforehand, bcrypt does this for us
    // just compare plaintext password to (hashed) User password
    bcrypt.compare(password, this.password, (err,isMatch) => 
    {
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
        }
    });    
}

User.methods.getResetPasswordToken = function () 
{
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
      .createHash(process.env.HASH)
      .update(resetToken)
      .digest(process.env.DIGEST);
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  
    return resetToken;
};

module.exports = mongoose.model('User', User)