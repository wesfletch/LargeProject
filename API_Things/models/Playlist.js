const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    tracks : {
        type : [String]
    },
    createdWith : {
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
    
});

module.exports = mongoose.model('Playlist',PlaylistSchema);