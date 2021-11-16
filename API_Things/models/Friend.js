const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    fav_genres : {
        type : [String]
    },
    fav_artists : {
        type : [String]
    },
    fav_tracks : {
        type : [String]
    },
    playlists : [{type : mongoose.Schema.Types.ObjectId, ref: 'Playlist',
        required : false
    }],
});

module.exports = mongoose.model('Friend',FriendSchema);