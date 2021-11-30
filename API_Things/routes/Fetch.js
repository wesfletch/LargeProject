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

/**
  * @swagger
  * /artist:
  * get:
  *     description: Search for artist by exact name
  *     parameters:
  *         -in: body
  *         name: body    
  *         required: true
  *         description: name of the artist
  *     requestBody:
  *         content:
  *         application/json: 
  *             artist: "name"
  *     responses:
  *     200:
  *         description: artist found
  *         content:
  *             application/json:
  *                 name: "artist.name"
  *                 id : "artist.id"
  *                 image : "artist.images[2].url"
  *     500:
  *         description: artist not found
  *     401:
  *         description: Bad or expired token
  *     403:
  *         description: Bad OAuth request
  *     429:
  *         description: The app has exceeded its rate limits
  */

// Search artists by name/get ArtistID
//This returns the artist with the exact matching name (name, id, image link)
spotifyRouter.get("/artist/", (req, res) => {
    spotifyApi.searchArtists(req.body.artist).then((data) => {
        var match = {};
        data.body.artists.items.every((artist, i) => {
            if(req.body.artist.toLowerCase() == artist.name.toLowerCase()){
                match = {
                    name : artist.name,
                    id : artist.id,
                    image : artist.images[2].url
                }
                res.json(match);
                console.log("Artist " + match.name + " found\nArtist ID: " + match.id );
                return match;
            }
        });
        if(JSON.stringify(match) === '{}'){
 
            const text = {"Error": "Artist not found"};
            console.log("Artist not found");
            res.send(text.Error);
            return res;
            
        }
    }).catch((err) => console.log(err));
});


/**
  * @swagger
  * /fetch/artists:
  * get:
  *     description: Search for artist by name
  *     parameters:
  *         -in: body
  *         name: body    
  *         required: true
  *         description: name of the artist
  *     requestBody:
  *         content:
  *         application/json: 
  *             artist: "name"
  *     responses:
  *     200:
  *         description: artist found
  *         content:
  *             type: array
  *             application/json:
  *                 name: "artist.name"
  *                 id : "artist.id"
  *                 image : "artist.images[2].url"
  *     500:
  *         description: artist not found
  *     401:
  *         description: Bad or expired token
  *     403:
  *         description: Bad OAuth request
  *     429:
  *         description: The app has exceeded its rate limits
  */

// Search artists by name
//This returns an array of matching artists (name, id, image link)
spotifyRouter.get("/artists/", (req, res) => {
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
    }).catch((err) => console.log(err));
});

/**
  * @swagger
  * /fetch/artist:
  * get:
  *     description: Search for song by name
  *     parameters:
  *         -in: body
  *         name: body    
  *         required: true
  *         description: name of the song
  *     requestBody:
  *         content:
  *         application/json: 
  *             track: "song name"
  *     responses:
  *     200:
  *         description: matching songs found
  *         content:
  *             type: array
  *             application/json:
  *                 name: "track.name"
  *                 id : "track.id"
  *                 artist : "track.artist[0].name"
  *                 preview : "track.preview_url"
  *                 url_link : "track.external_urls.spotify"
  *     500:
  *         description: song not found
  *     401:
  *         description: Bad or expired token
  *     403:
  *         description: Bad OAuth request
  *     429:
  *         description: The app has exceeded its rate limits
  */

// Search tracks by name/get TrackID
//This returns an array of matching tracks (name, id, artist, song preview link, song link)
spotifyRouter.get("/track/", (req, res) => {
    spotifyApi.searchTracks(req.body.track,{limit: 10}).then((data) => {
        var tracks = [];
        if(!data.body.tracks.items[0]){
            const text = {"Error": "No tracks found"};
            console.log("No tracks found");
            res.send(text.Error);
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
        res.json(tracks);
        return tracks;
    }).catch((err) =>console.error(err));
});

/**
  * @swagger
  * /fetch/genres:
  * post:
  *     description: Get Spotify's available genres
  *     parameters: none
  *     responses:
  *     200:
  *         description: a list of Spotify's available genres
  *         content:
  *             type: array
  *             application/json:
  *                 "genre"
  *     500:
  *         description: Error connecting to Spotify
  *     401:
  *         description: Bad or expired token
  *     403:
  *         description: Bad OAuth request
  *     429:
  *         description: The app has exceeded its rate limits
  */


//Get available genre seeds
//This returns an array of all genres 
spotifyRouter.get("/genres", (req, res) => {
    spotifyApi.getAvailableGenreSeeds().then((data) => {
        res.json(data.body.genres)
    }).catch((err) => console.log('Error getting genre list!', err)); 
  
});

/**
  * @swagger
  * /fetch/artist:
  * post:
  *     description: get recommendations
  *     parameters:
  *         -in: body
  *         name: body    
  *         required: true
  *         description: Artist ID, Song ID, Genre
  *         maxSize: 5
  *         minSize: 1
  *     requestBody:
  *         content:
  *         application/json: 
  *             seed_artists: ["artist.id"]
  *             seed_genres: ["genre"]
  *             seed_tracks: ["track.id"]
  *     responses:
  *     200:
  *         description: matching songs found
  *         content:
  *             type: array
  *             application/json:
  *                 name: "track.name"
  *                 id : "track.id"
  *                 artist : "track.artist[0].name"
  *                 preview : "track.preview_url"
  *                 url_link : "track.external_urls.spotify"
  *     500:
  *         description: Error getting recommendations
  *     401:
  *         description: Bad or expired token
  *     403:
  *         description: Bad OAuth request
  *     429:
  *         description: The app has exceeded its rate limits
  */


//Get Recommendations Based on Seeds
//This returns an array of 10 songs (name, id, artist, song preview link, song link)
spotifyRouter.get("/recs", (req, res) => {
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
        res.json(tracks);
        return tracks;
    }).catch((err) => console.log('Error fetching reccomendations!', err)); 
});


module.exports = spotifyRouter;

