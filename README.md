# All off my updated files can be found in the "API_Things" folder.   

# Updates:
    -I added a field for images on the User and Friend schema incase we want to 
     implement profile pictues.
    -I added a "sharedWith" field to the playlist schema so the friend a playlist 
     was made with can be saved.
    -I added the Spotify Api.
     
     There are now two API routes, /User and /Fetch
		- /User is for all user related requests
		- /Fetch is for all Spotify API requests

## Information on the Spotify API:</br>
	In order to get recommendations, the Spotify API only accepts ArtistIDs and TrackIDs, 
	not track or artist names. So the /artist, /artists, and /track endpoints pull the    
	ArtistID and TrackID from Spotify.  

	To get the ArtistID I implemented two endpoints, one that gets the exact match    
	based on name and one that returns an array of possible matches.   

	But for tracks I only implemented on endpoint that returns an array of possible matches.  
	I did this because a lot of songs have the same name and it's easy to misspell a song's name.  
	So, I thought it'd be best if the user had a choice of possible correct songs to select from.

												     
## **Information for /Fetch**
    
**/fetch/artist**
		
        GET request:
		Takes in an artist's name, searches it in Spotify's database and returns    
		the exact match. The response contains the artist's name, ID, and image.

        Input json: 
	{artist: "artist's name"}

        Match response:
        {
            name : artist.name,
            id : artist.id,
            image : artist.images[2].url
        }

        No match response:
        {"Artist not found"}

**/fetch/artists**
    
        GET request:
		Takes in an artist's name, searches it in Spotify's database and returns    
		an array of possible matches. It returns an array named "artists" that     
		contains all the matching artists' names, IDs, and images. The max array   
		size is set at 10.

        Input json: 
	{artist: "artist's name"}

         Match response: 
            artists = [ 
                {
                    name : artist.name,
                    id : artist.id,
                    image : artist.images[2].url
                },
                {},
                {},
                ....
            ]

        No match response:
        {"Artists not found"}


**/fetch/track**
    
        GET request:
		Takes in a track name, searches it in Spotify's database and returns    
		an array of possible matches. It returns an array named "tracks" containing    
		the name, ID, artist, preview link, and track link of all the matching tracks.   
		The max array size is set at 10.
	
        Input json: 
	{artist: "track name"}

         Match response: 
            tracks= [ 
                {
                    "name": track.name,
                    "id": track.id,
                    "artist": track.artists[0].name,
                    "preview": track.preview_url,
                    "url_link": track.external_urls.spotify
                },
                {},
                {},
                .......
            ]

        No match response:
        {"Tracks not found"}

**/fetch/genres**
    
        GET request:
		Takes in no input. Returns an unnamed array of all of Spotify's available genres.

        Response:
        [
            "acoustic",
            "afrobeat",
            "alt-rock",
            "alternative",
            "ambient",
            "anime"....
        ]

**/fetch/recs**
    
        GET request:
		Takes in only five seeds/inputs made up of artist IDs, track IDs, and genres. 
		The seeds can be any combination of the 3 fields (i.e. 3 traaks and 2 genres, or    
		4 artists and 1 genre, or 2 tracks, 2 genres, and 1 artist).     
		But the number seeds can not exceed 5. The max amount of songs is set at 10 and    
		the market is set to the US.
		It returns an array named "tracks" containing the name, ID, artist,    
		preview link, and track link of all the reccomended tracks.

	Input json:
	{
            seed_artists: ['ArtistID']
            seed_genres: ['Genre Name']
            seed_tracks: ['TrackID']
        }
	
        Example input json:
        {
            seed_artists: ['4kYSro6naA4h99UJvo89HB', '3TVXtAsR1Inumwj472S9r4']
            seed_genres: ['hip-hop', 'r-n-b']
            seed_tracks: '3A2yGHWIzmGEIolwonU69h'
        }

        Response:
            tracks= [ 
                {
                    "name": track.name,
                    "id": track.id,
                    "artist": track.artists[0].name,
                    "preview": track.preview_url,
                    "url_link": track.external_urls.spotify
                },
                {},
                {},
                .......
            ]

## **Information for /User:**

**/user/register**
    
        POST request:
		Takes in the fields on the User schena, validates all fields, checks the    
		database for matching email and password pair, and then saves the user    
		to the database.
    
**/user/login**
    
        POST request:  
		Takes in user email and password, validates that they were entered correctly,    
		checks the entered info in the database, then logs in the user by passing    
		an authentication cookie.

**/user/logout**
    
        GET request:
		Logs user out by deleting authentication cookie.

**/user/friend**
    
        POST request:
		Takes in all fields of the friend schema and adds a new friend to     
		the user's account by attatching the user's ID to the new friend schema.

**/user/friends**
    
        GET request:
		Takes in the user's ID, uses it to search for all friend with the     
		attached ID and returns an array of all the user's friends.

**/user/friends/:id**
    
        PUT request:
		Takes in the ID of a specific friend, and the values to be edited    
		and edits the friend's schema. 
        
        DELETE request:
		Takes in the ID of a specific friend and deletes their schema     
		from the database.

**/user/playlist**
    
        POST request:
		Takes in all fields of the playlist schema and adds a new playlist to  
		the user's account by attatching the user's ID to the new playlist schema.

**/user/playlists**
    
        GET request:
		Takes in the user's ID, uses it to search for all playlists with  
		the attached ID and returns an array of all the user's playlists.

**/user/playlist/id**
    
        PUT request:
		Takes in the ID of a specific playlist, and the values to be edited  
		and edits the playlist's schema. 
        
        DELETE request:
		Takes in the ID of a specific playlist and deletes the schema    
		from the database.

**/user/authenticated**
    
        GET request:
		Checks if a user is authenticated, meaning they have access to    
		the areas of the site only accessible by registered users.


