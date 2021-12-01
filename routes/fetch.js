var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const spotifyRouter = express.Router();
require("dotenv").config({path:'./.env'});

/*---------------------------------------------------*/
//                   Spotify APIs
/*---------------------------------------------------*/

//Creating the api object
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.client_id,
    clientSecret: process.env.client_secret,
});

//Funtion for the access token
function token(){
    spotifyApi.clientCredentialsGrant().then((data) => {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    }).catch((error) => console.log('Error retrieving access token', error));
};
token();

//Refreshes the access token every hour
//Spotify's Client Credential flow does not have a refresh token
setInterval(token, 3600000);

// Search artists by name/get ArtistID
//This returns the artist with the exact matching name (name, id, image link)
spotifyRouter.post("/artist/", (req, res) => {
    spotifyApi.searchArtists(req.body.artist).then((data) => {
        var match = {};
        data.body.artists.items.every((artist, i) => {
            if(req.body.artist.toLowerCase() == artist.name.toLowerCase()){
                match = {
                    name : artist.name,
                    id : artist.id,
                    image : artist.images[2].url
                }
                res.status(200).json(match);
                console.log("Artist " + match.name + " found\nArtist ID: " + match.id );
                return match;
            }
        });
        if(JSON.stringify(match) === '{}'){
 
            const text = {"Error": "Artist not found"};
            console.log("Artist not found");
            res.status(500).send(text.Error);
            return res;   
        }
    }).catch((err) => 
    {
        res.status(501).json({message : {msgBody : "Error retrieving artists.", msgError : true}});
    });
});

// Search artists by name
// This returns an array of matching artists (name, id, image link)
spotifyRouter.post("/artists/", (req, res) => {
    spotifyApi.searchArtists(req.body.artist, {limit: 10}).then((data) => {
        var artists = [];
        if(!data.body.artists.items[0]){
            const text = {"Error": "No artists found"};
            console.log("No artists found");
            res.send(text);
            return res;
        };
        data.body.artists.items.forEach((artist,i) => {
            artists.push({
                'name': artist.name,
                'id': artist.id,
                'image': artist.images[2].url
            });
        });
        console.log("Matching artists found");
        res.json(artists);
        return artists;
    }).catch((err) => 
    {
        res.status(501).json({message : {msgBody : "Error finding artist(s).", msgError : true}});
    });
});

// Search tracks by name/get TrackID
//This returns an array of matching tracks (name, id, artist, song preview link, song link)
spotifyRouter.post("/track/", (req, res) => {
    
    console.log(req.body);

    spotifyApi.searchTracks(req.body.track,{limit: 10}).then((data) => {
        var tracks = [];
        if(!data.body.tracks.items[0]){
            const text = {"Error": "No tracks found"};
            console.log("No tracks found");
            res.status(500).send(text.Error);
            return res;
        };
        data.body.tracks.items.forEach((track, i) => {
            tracks.push({
                "name": track.name,
                "id": track.id,
                "artist": track.artists[0].name,
                "preview": track.preview_url,
                "url_link": track.external_urls.spotify
            });
        });
        console.log("Matching tracks found");
        res.status(200).json(tracks);
        return tracks;
    }).catch((err) =>
    {
        res.status(501).json({message : {msgBody : "Error retrieving track(s).", msgError : true}});
    });
});

//Get available genre seeds
//This returns an array of all genres 
spotifyRouter.get("/genres", (req, res) => {
    spotifyApi.getAvailableGenreSeeds().then((data) => {
        res.status(200).json(data.body.genres)
    }).catch((err) => 
    {
        res.status(501).json({message : {msgBody : "Error retrieving genres.", msgError : true}});
    });
  
});

//Get Recommendations Based on Seeds
//This returns an array of 10 songs (name, id, artist, song preview link, song link)
spotifyRouter.post("/recs", (req, res) => {
    var tracks =[];
    var seeds = {
        ...req.body,
        limit: 10, 
        market: "US"
    }

    spotifyApi.getRecommendations(seeds).then((data) => {
        return data.body.tracks.map((track) => {
            return track.id;
        });
    }).then((trackIds) => {
        return spotifyApi.getTracks(trackIds);
    }).then((data) => {
        data.body.tracks.forEach((track, i) => {
            tracks.push({
                "name": track.name,
                "id": track.id,
                "artist": track.artists[0].name,
                "preview": track.preview_url,
                "url_link": track.external_urls.spotify
            });
        });
        console.log("Recommendations found");
        res.status(200).json(tracks);
        return tracks;
    }).catch((err) => 
    {
        res.status(501).json({message : {msgBody : "Error retrieving recommendations.", msgError : true}});
    });
});


module.exports = spotifyRouter;

