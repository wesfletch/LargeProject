# Updates:
    -Updated the login and registration endpoints to no longer require the 
     validation files. The valisation code is now in the endpoint coding.
    
    -Updated the "delete friend", as it was deleting the friend from the database
    not the user's friend list.
    
    -Updated the "add friend" endpoint so now it adds other users, instead of adding 
     a friend like a contact app.
     
    -Changed the add playlist endpoint from "/playlist" to "/addplaylist"
    
    -Changed the add friend endpoint from "/friend" to "/add"
    
    -Updated the "add friend" endpoint so now it does validation checks and simultaneously 
     adds a user to the friend list of the friend they are adding. (the simultaneous add was 
     implemented due to timiming but the code can easily be updated to instead ask the added
     user if they want to also add the user to their friend list, if it's not a hassle to
     the front end and web app).
    
    -Removed the "edit friend" endpoint as a result of the above change. So, users cannot 
     edit other users' profiles.
    
    -Removed the "isAuthenticated" endpoint.
    
    -Added the "edit user" endpoint.
    
    -Added the "forgot password" and "reset password" endpoint.
    
    -Added the "send email" functionality, so users will get an email when they register and
     when they forget their password.
    
    -Updated the User model
	-Added resetPasswordToken and resetPasswordExpire fields
	-Removed the firstName and lastName fields
	-Added the "name" field in place of the above fields
    
    -Added swaggerHub documenttion using swaggerUI and swaggerJsDoc to the spotify endpoints
     but could not get it to show up in swaggerHub. I'll need assistance with this.
    
    ------------------------------------------------------------------------
    -I added a field for images on the User and Friend schema incase we want to 
     implement profile pictues.
    -I added a "createdWith" field to the playlist schema so the friend a playlist 
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
   
**Get One Artist**   
**/fetch/artist**
		
	GET request:
		Takes in an artist's name, searches it in Spotify's database and returns    
		the exact match. The response contains the artist's name, ID, and image.

	Input json: 
		{artist: "artist's name"}

	Success response:
		200:
			{
				name : artist.name,
				id : artist.id,
				image : artist.images[2].url
			}

	No match response:
		{"Artist not found"}
	
	Error responses:
		500:
			description: artist not found
		401:
			description: Bad or expired token
		403:
			description: Bad OAuth request
		429:
			description: The app has exceeded its rate limits

**Get A List Of Matching Artists**</br>
**/fetch/artists**
    
	GET request:
		Takes in an artist's name, searches it in Spotify's database and returns    
		an array of possible matches. It returns an array named "artists" that     
		contains all the matching artists' names, IDs, and images. The max array   
		size is set at 10.

	Input json: 
		{artist: "artist's name"}

	Success response: 
		200:
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
		
	Error responses:
		500:
			description: artist not found
		401:
			description: Bad or expired token
		403:
			description: Bad OAuth request
		429:
			description: The app has exceeded its rate limits

**Get A List Of Matching Tracks**</br>
**/fetch/track**
    
	GET request:
		Takes in a track name, searches it in Spotify's database and returns    
		an array of possible matches. It returns an array named "tracks" containing    
		the name, ID, artist, preview link, and track link of all the matching tracks.   
		The max array size is set at 10.
	
	Input json:   
		{artist: "track name"}

	Sucess response: 
		200:
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
	
	Error responses:
		500:
			description: song not found
		401:
			description: Bad or expired token
		403:
			description: Bad OAuth request
		429:
			description: The app has exceeded its rate limits

**Get All Genres** </br>
**/fetch/genres**
    
	GET request:
		Takes in no input. Returns an unnamed array of all of Spotify's available genres.

	Success Response:
		200:
		[
			"acoustic",
			"afrobeat",
			"alt-rock",
			"alternative",
			"ambient",
			"anime"....
        	   ]
	
	Error responses:
		500:
			description: Error connecting to Spotify
		401:
			description: Bad or expired token
		403:
			description: Bad OAuth request
		429:
			description: The app has exceeded its rate limits

**Get Recommendations**</br>
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

	Sucess Response:
		200:
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
	    
	Error responses:
		500:
			description: Error getting recommendations
		401:
			description: Bad or expired token
		403:
			description: Bad OAuth request
		429:
			description: The app has exceeded its rate limits

## **Information for /User:**

**Registration**</br>
**/user/register**

	POST request:
		Takes in the fields on the User schena, validates all fields, checks the    
		database for matching email and password pair, and then saves the user    
		to the database.
	
	Input:
		{
		"name": "string",
		"email": "string",
		"password": "string",
		"password2": "string",
		}
	
	Success response:
		Status(200): "User successfully saved."
		
	Error responses:
		500: "Error searching database."
		400: "Error: Email is already taken."
		401: "Error: Invalid email."
		402: "Error: Password must be between 6 and 30 characters"
		403: "Error: Passwords must match."
		405: "Error: Please provide an email, name, and password."
		500: "Error saving to database."
		501: "Error: User saved. Email could not be sent.",

**Login**</br>
**/user/login**
    
	POST request:  
		Takes in user email and password, validates that they were entered correctly,    
		checks the entered info in the database, then logs in the user by passing    
		an authentication cookie.
	
	Input:
		{
			"email": "string",
			"password": "string"
		}
	
	Success response:
		Status(200): "Successfully logged in. "
		
	Error responses:
		Status(400): "Error: Please provide an email and password."
		
**Logout**</br>
**/user/logout**
	
	GET request:
		Logs user out by deleting authentication cookie.
		
**Update User**</br>
**/update/:id**

	PUT request:
		Updates the user's profile information. Can be used to update any the following
		fields: name, email, image, fav_genres, fav_artists, fav_tracks. All fields do 
		not need to be filled in. Only add the field that is to be changed.
		Takes in userID from the url.
	Input:
	{
		"email" : "string",
		"password" : "string",
		"image" : "string",
		"fav_genres" : "string",
		"fav_artists" : "string",
		"fav_tracks" : "string"
	}
	
	Success response:
		Status(200): "Successfully Edited User."
		
	Error responses:
		Status(500): "Error editing user."

**Forgot Password**</br>
**/forgot**

	POST request:
		Takes in an email address, checks if it exists in the database and 
		then sends the user a "Reset Password" email that has a reset password 
		link.
	
	Input:
	{
		"email" : "string"
	}
	
	Success response:
		Status(200): "Email successfully sent."
		
	Error responses:
		Status(400): "Error: Email could not be sent."  <-- Means user was not found
		Status(500): "Error sending email."
		Status(501): "An Error Occured."
	
**Reset Password**</br>
**/reset/:resetToken**

	PUT request:
		Takes in the reset token from the url and compares it with the reset token in the user's schema
		to authenticate it. Takes in two password fields, confirms that they match and then saves the new
		password.
	
	Input:
	{
		"password" : "string",
		"password2" : "string"
	}
	
	Success response:
		200: "Password Successfully Updated."
		
	Error responses:
		400: "Error: Invalid Token."
		401: "Error: Passwords must match."
		500: "Error: Unable to update password."

**Add Friend**</br>
**/user/add**
    
	POST request:
		Takes in an email address, searches it in the data, then if found checks 
		if user already has friend in friend list, then adds the friend to the 
		user's friend list and simultaneously adds the user to the added friend's 
		friend list.
	
	Input:
	{
		"email" : "string",
	}
	
	Success response:
		Status(200): "Successfully added friend."
		
	Error responses:
		500: "Error finding friends."
		404: "Error: User not found."
		501: "Error adding friends."
		401: "Error: User is already your friend."
		
**Get All Friends**</br>
**/user/friends**
    
	GET request:
		Uses the user's ID to search for all friends within the user's     
		friend list and returns a document with an array of objectIDs of 
		all the user's friends.
		
	Success response:
		200: {friends : document.friends}
		
	Error responses:
		500: "Error fetching friends."



**Delete a Friend**</br>
**/user/friend/:id**
    
	DELETE request:
		Takes in the friend's ID from the url, uses it to search for the friend
		in the user's friend list, then if found deletes the friend from the 
		user's friend list.
		
	Success response:
		200: "Friend successfully deleted."
		
	Error responses:
		500: "Error deleting friend."

**Add Playlist**</br>
**/user/addplaylist**
    
	POST request:
		Takes in all fields of the playlist schema and adds a new playlist to  
		the user's account.
		
	Example Input:
	{
		"name" : "string",
		"tracks" : "S1, S2, S3, S4, S5, S6, S7, S8, S9, S10"
	}
	
	Success response:
		200: "Successfully created paylist."
		
	Error responses:
		500: "Error adding playlist."
		501: "Error saving playlist."

**Get All Playlists**</br>
**/user/playlists**
    
	GET request:
		Uses the user's ID to search for all playlists within the user's     
		playlist list and returns a document with an array of objectIDs 
		of all the user's playlists.
		
	Success response:
		200: {playlists : document.playlists}
		
	Error responses:
		500: "Error fetching playlists."
		
**Edit Playlist"**</br>
**/user/playlist/id**
    
	PUT request:
		Gets the ID of a specific playlist from the url and takes in 
		the values to be edited and edits the playlist's schema. 
		
	Example Input:
	{
		"name" : "string",
		"tracks" : "S1, S2, S3, S4, S5, S6, S7, S8, S9, S10"
	}
	
	Success response:
		200: "Successfully Updated Paylist."
		
	Error responses:
		500: "Error updating playlist."
			
**Delete Playlist"**</br>
**/user/playlist/id**		
		
	DELETE request:
		Gets the ID of a specific playlist from the url and deletes it    
		from the database.
		
	Success response:
		200: "Successfully Deleted Paylist."
		
	Error responses:
		500: "Error deleting playlist."


