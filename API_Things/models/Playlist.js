const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    tracks : {
        type : [String]
    },
    sharedWith : {type : mongoose.Schema.Types.ObjectId, 
        ref: 'Friend'
    }
    
});

module.exports = mongoose.model('Playlist',PlaylistSchema);