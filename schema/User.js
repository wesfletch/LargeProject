const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
require("dotenv").config({path:'../.env'});

const reqString = {
    type: String, 
    required: true
}

const User = new mongoose.Schema({
    display_name: {type: String, required: true, trim: true},
    email: {type: String, required: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    image:{type: String, trim: true},
    date: {type: Date, default: Date.now},
    fav_genres : [{type: String, _id: false}],
    fav_artists :[{type: String, _id: false}],
    fav_tracks : [{type: String, _id: false}],
    friends : [{type : mongoose.Schema.Types.ObjectId, ref: 'User'}],
    playlists : [{type : mongoose.Schema.Types.ObjectId, ref: 'Playlist'}],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: {type: Boolean, default: false}
});
User.index({display_name: 'text', email: 'text'});

//Encrypts the user's password before saving
User.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

//Compares user's entered password to their encrypted password
User.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//Sets the reset password token.
User.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString(process.env.DIGEST);
  
    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
      .createHash(process.env.HASH)
      .update(resetToken)
      .digest(process.env.DIGEST);
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
    return resetToken;
};

//Compares password for authentication
User.methods.comparePassword = function(password,callback){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return callback(err);
        else{
            if(!isMatch)
                return callback(null,isMatch);
            return callback(null,this);
        }
    });
};

module.exports = mongoose.model('User', User);