const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const reqString = {
    type: String, 
    required: true
}

const userSchema = mongoose.Schema({
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
})

// for password encryption
userSchema.pre('save', function(next)
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

userSchema.methods.comparePassword = function(password,cb) 
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

//if you want one of the catagories to be required all you have to do is change 'String,' to: 'reqString,'

module.exports = user = mongoose.model('users', userSchema)