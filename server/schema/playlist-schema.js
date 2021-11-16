const mongoose = require('mongoose')

const reqString = {
    type: String, 
    required: true
}

const playlistSchema = mongoose.Schema({
    user: String,
    friend: String,
    type: String,
    songs: Array,
})

//if you want one of the catagories to be required all you have to do is change 'String,' to: 'reqString,'

module.exports = mongoose.model('playlists', playlistSchema)