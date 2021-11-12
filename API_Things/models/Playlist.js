const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    tracks : {
        type : [String]
    }
    
});

module.exports = mongoose.model('Playlist',PlaylistSchema);