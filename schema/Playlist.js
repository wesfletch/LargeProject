const mongoose = require('mongoose');

const Playlist = mongoose.Schema({
    name : {type : String, required : true},
    user: {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    friend: {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    songs : [{type: String, _id: false}],
    tracks: [{
        name : {type : String},
        id : {type : String, default: null},
        artist : {type : String, default: null},
        preview : {type : String, default: null},
        url_link : {type : String, default: null} ,
    }],
})

module.exports = mongoose.model('Playlist',Playlist);
