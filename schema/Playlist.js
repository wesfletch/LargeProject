const mongoose = require('mongoose')

const reqString = {
    type: String, 
    required: true
}

const Playlist = mongoose.Schema({
    name: String,
    user: {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    friend: {type: mongoose.Schema.Types.ObjectId, ref: 'Friend', required: false},
    type: String,
    songs: Array,
})

//if you want one of the catagories to be required all you have to do is change 'String,' to: 'reqString,'

module.exports = mongoose.model('playlists', Playlist)
