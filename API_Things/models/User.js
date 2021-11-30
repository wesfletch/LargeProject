const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    image:{type: String, trim: true},
    date: {type: Date, default: Date.now},
    fav_genres : {type : [String]},
    fav_artists : {type : [String]},
    fav_tracks : {type : [String]},
    friends : [{type : mongoose.Schema.Types.ObjectId, ref: 'User'}],
    playlists : [{type : mongoose.Schema.Types.ObjectId, ref: 'Playlist'}],
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

UserSchema.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
        }
    });
};

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  
    return resetToken;
};

module.exports = mongoose.model('User',UserSchema);