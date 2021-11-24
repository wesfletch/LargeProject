const mongoose = require('mongoose')

const reqString = {
    type: String, 
    required: true
}

const Friend = mongoose.Schema({
    country: String,
    display_name: String,
    email: String,
    spotify_uri: String,
    link: String,
    ID: String,
    profile_image: String,
    product: String,
    type: String,
    access_token: String,
    refresh_token: String,
    top_music: Array,
    top_artists: Array,
    playlists : [{type : mongoose.Schema.Types.ObjectId, ref: 'Playlist', required : false}],
})

//if you want one of the catagories to be required all you have to do is change 'String,' to: 'reqString,'

// register the model
module.exports = mongoose.model('Friend', Friend)