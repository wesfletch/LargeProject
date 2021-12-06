const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const spotifyRouter = express.Router();
const _ = require('underscore');
const stringSimilarity = require("string-similarity");
require("dotenv").config({path:'./.env'});

//Creating the api object
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.client_id,
    clientSecret: process.env.client_secret,
});

//Function for the access token
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

/*---------------------------------------------------*/
//                   Spotify APIs
/*---------------------------------------------------*/

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
spotifyRouter.post("/track", (req, res) => {
    
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
        return res.json(data.body.genres)
    }).catch((err) => console.log('Error getting genre list!', err)); 
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

//=================================================================//
//-------------------New Recommendation Pipline--------------------//
//=================================================================//
/*Takes in Artists, Tracks, and Genres as strings and converts 
  the Artists to artistID and the Tracks to trackIDS and gets the 
closest matching Spotify genre*/

spotifyRouter.get("/recspipe", async(req, res) => {
    var track_ids = [];
    var artist_ids = [];
    var allgenres = [];

    try{
        if(req.body.tracks.length != 0){
            await Promise.all(
                req.body.tracks.map(async(track) =>{
                    var data = await spotifyApi.searchTracks(track,{limit: 1});
                    var id = await data.body.tracks.items[0].id
                    track_ids.push(id);
                })
            )
        }

        if(req.body.artists.length != 0){
            await Promise.all(
                req.body.artists.map(async(artist) =>{
                    var data2 = await spotifyApi.searchArtists(artist,{limit: 1})
                    var id = await data2.body.artists.items[0].id
                    artist_ids.push(id);
                })
            )
        }

        if(req.body.genres.length != 0){
            var data3 = await spotifyApi.getAvailableGenreSeeds();
            await Promise.all(
                req.body.genres.map(async(genre) =>{
                    var match = await stringSimilarity.findBestMatch(genre, data3.body.genres);
                    console.log("Best Match: " + match.bestMatch.target);
                    allgenres.push(match.bestMatch.target)
                })
            )
        };
        
        console.log(artist_ids)
        console.log(allgenres)
        console.log(track_ids)

        var results =[];
        var seeds = {
            seed_artists: artist_ids,
            seed_genres: allgenres,
            seed_tracks: track_ids,
            limit: 10, 
            market: "US"
        }

        spotifyApi.getRecommendations(seeds).then((data) => {
            data.body.tracks.forEach((track, i) => {
                results.push({
                    "name": track.name,
                    "id": track.id,
                    "artist": track.artists[0]?.name,
                    "preview": track.preview_url,
                    "url_link": track.external_urls.spotify
                });
            });
            console.log("Recommendations found");
            return res.status(200).json(results);
        })

    }catch(err){
        if(err){    
            return res.json({message : {msgBody : "Error compiling recommendation seeds.", msgError : err}});
        }
    };
});

//=================================================================//
//------------------------NEW Query APIs---------------------------//
//=================================================================//
/*Same as the above "old" APIs but uses query instead of a request body*/

// Search artists by name/get ArtistID
//This returns the artist with the exact matching name (name, id, image link)
spotifyRouter.get("/artist2", (req, res) => {
    spotifyApi.searchArtists(req.query.artist).then((data) => {
        var match = {};
        data.body.artists.items.every((artist, i) => {
            if(req.query.artist.toLowerCase() == artist.name.toLowerCase()){
                match = {
                    name : artist.name,
                    id : artist.id,
                    image : artist.images[2]?.url
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

// Search artists by name
//This returns an array of matching artists (name, id, image link)
spotifyRouter.get("/artists2", (req, res) => {
    spotifyApi.searchArtists(req.query.artist).then((data) => {
        var artists = [];
        if(!data.body.artists.items[0]){
            const text = {"Error": "No artists found"};
            console.log("No artists found");
            res.send(text);
            return res;
        };
        data.body.artists.items.forEach(async(artist,i) => {
            artists.push({
                'name': artist.name,
                'id': artist.id,
                'image': artist.images[2]?.url
            });
        });
        console.log("Matching artists found");
        res.json(artists);
        return artists;
    }).catch((err) => console.log(err));
});

// Search tracks by name/get TrackID
//This returns an array of matching tracks (name, id, artist, song preview link, song link)
spotifyRouter.get("/track2", (req, res) => {
    spotifyApi.searchTracks(req.query.track,{limit: 10}).then((data) => {
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
                "artist": track.artists[0]?.name,
                "preview": track.preview_url,
                "url_link": track.external_urls.spotify
            });
        });
        console.log("Matching tracks found");
        res.json(tracks);
        return tracks;
    }).catch((err) =>console.error(err));
});

//Get Recommendations Based on Seeds
//This returns an array of 10 songs (name, id, artist, song preview link, song link)
spotifyRouter.get("/recs2", (req, res) => {
    var tracks =[];
    var seeds = {
        ...req.query,
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
                "artist": track.artists[0]?.name,
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

