


https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_artists=${artists}&seed_genres=${genres}&seed_tracks=${tracks}


const APIController = (function() {
    
    const clientId = 'ADD YOUR CLIENT ID';
    const clientSecret = 'ADD YOUR CLIENT SECRET';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();



{
    "tracks": [
      {
        "album": {
          "album_type": "ALBUM",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/0vUnn6Eje2O5yxEj35touD"
              },
              "href": "https://api.spotify.com/v1/artists/0vUnn6Eje2O5yxEj35touD",
              "id": "0vUnn6Eje2O5yxEj35touD",
              "name": "Tenebrae",
              "type": "artist",
              "uri": "spotify:artist:0vUnn6Eje2O5yxEj35touD"
            }
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/3fvFlaBBbAFO0QCrSTbfaU"
          },
          "href": "https://api.spotify.com/v1/albums/3fvFlaBBbAFO0QCrSTbfaU",
          "id": "3fvFlaBBbAFO0QCrSTbfaU",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b273173d17db2abbefa4569b4dca",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/ab67616d00001e02173d17db2abbefa4569b4dca",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/ab67616d00004851173d17db2abbefa4569b4dca",
              "width": 64
            }
          ],
          "name": "Allegri Miserere",
          "release_date": "2006-10-03",
          "release_date_precision": "day",
          "total_tracks": 13,
          "type": "album",
          "uri": "spotify:album:3fvFlaBBbAFO0QCrSTbfaU"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/4I47QTluHCo2t2Gj6V7AIG"
            },
            "href": "https://api.spotify.com/v1/artists/4I47QTluHCo2t2Gj6V7AIG",
            "id": "4I47QTluHCo2t2Gj6V7AIG",
            "name": "Gregorio Allegri",
            "type": "artist",
            "uri": "spotify:artist:4I47QTluHCo2t2Gj6V7AIG"
          },
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/0vUnn6Eje2O5yxEj35touD"
            },
            "href": "https://api.spotify.com/v1/artists/0vUnn6Eje2O5yxEj35touD",
            "id": "0vUnn6Eje2O5yxEj35touD",
            "name": "Tenebrae",
            "type": "artist",
            "uri": "spotify:artist:0vUnn6Eje2O5yxEj35touD"
          }
        ],
        "disc_number": 1,
        "duration_ms": 719133,
        "explicit": false,
        "external_ids": {
          "isrc": "GBLLH0608509"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2ED1VZ53iRImo252U2PEsu"
        },
        "href": "https://api.spotify.com/v1/tracks/2ED1VZ53iRImo252U2PEsu",
        "id": "2ED1VZ53iRImo252U2PEsu",
        "is_local": false,
        "is_playable": true,
        "name": "Miserere",
        "popularity": 43,
        "preview_url": "https://p.scdn.co/mp3-preview/35d9eb9a771d25ed26eb864bffc5fd8a56fb660d?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 9,
        "type": "track",
        "uri": "spotify:track:2ED1VZ53iRImo252U2PEsu"
      },
      {
        "album": {
          "album_type": "ALBUM",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
              },
              "href": "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
              "id": "4NHQUGzhtTLFvgF5SZesLK",
              "name": "Tove Lo",
              "type": "artist",
              "uri": "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
            }
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/6jggnLM3SdDnjQ3GWmIZ4L"
          },
          "href": "https://api.spotify.com/v1/albums/6jggnLM3SdDnjQ3GWmIZ4L",
          "id": "6jggnLM3SdDnjQ3GWmIZ4L",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b2735a032c46b63b202e76ebaffe",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/ab67616d00001e025a032c46b63b202e76ebaffe",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/ab67616d000048515a032c46b63b202e76ebaffe",
              "width": 64
            }
          ],
          "name": "BLUE LIPS (lady wood phase II)",
          "release_date": "2017-11-17",
          "release_date_precision": "day",
          "total_tracks": 14,
          "type": "album",
          "uri": "spotify:album:6jggnLM3SdDnjQ3GWmIZ4L"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
            },
            "href": "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
            "id": "4NHQUGzhtTLFvgF5SZesLK",
            "name": "Tove Lo",
            "type": "artist",
            "uri": "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
          }
        ],
        "disc_number": 1,
        "duration_ms": 258032,
        "explicit": true,
        "external_ids": {
          "isrc": "SEUM71701024"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/73kadnv7SduzhApfRUv5C0"
        },
        "href": "https://api.spotify.com/v1/tracks/73kadnv7SduzhApfRUv5C0",
        "id": "73kadnv7SduzhApfRUv5C0",
        "is_local": false,
        "is_playable": true,
        "name": "hey you got drugs?",
        "popularity": 50,
        "preview_url": null,
        "track_number": 14,
        "type": "track",
        "uri": "spotify:track:73kadnv7SduzhApfRUv5C0"
      }
    ],
    "seeds": [
      {
        "initialPoolSize": 257,
        "afterFilteringSize": 257,
        "afterRelinkingSize": 257,
        "id": "4NHQUGzhtTLFvgF5SZesLK",
        "type": "ARTIST",
        "href": "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK"
      },
      {
        "initialPoolSize": 307,
        "afterFilteringSize": 307,
        "afterRelinkingSize": 307,
        "id": "0c6xIDDpzE81m2q797ordA",
        "type": "TRACK",
        "href": "https://api.spotify.com/v1/tracks/0c6xIDDpzE81m2q797ordA"
      },
      {
        "initialPoolSize": 404,
        "afterFilteringSize": 404,
        "afterRelinkingSize": 404,
        "id": "classical",
        "type": "GENRE",
        "href": null
      },
      {
        "initialPoolSize": 391,
        "afterFilteringSize": 391,
        "afterRelinkingSize": 391,
        "id": "country",
        "type": "GENRE",
        "href": null
      }
    ]
}


artists.items.name

{
    "artists": {
      "href": "https://api.spotify.com/v1/search?query=drake&type=artist&offset=0&limit=20",
      "items": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
          },
          "followers": {
            "href": null,
            "total": 58574169
          },
          "genres": [
            "canadian hip hop",
            "canadian pop",
            "hip hop",
            "rap",
            "toronto rap"
          ],
          "href": "https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4",
          "id": "3TVXtAsR1Inumwj472S9r4",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb9e46a78c5cd2f7a8e7669980",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab676161000051749e46a78c5cd2f7a8e7669980",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f1789e46a78c5cd2f7a8e7669980",
              "width": 160
            }
          ],
          "name": "Drake",
          "popularity": 99,
          "type": "artist",
          "uri": "spotify:artist:3TVXtAsR1Inumwj472S9r4"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/0p4ViyfJUTW0IT4SCBLexf"
          },
          "followers": {
            "href": null,
            "total": 187895
          },
          "genres": [
            "cali rap",
            "vapor trap"
          ],
          "href": "https://api.spotify.com/v1/artists/0p4ViyfJUTW0IT4SCBLexf",
          "id": "0p4ViyfJUTW0IT4SCBLexf",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eba603aef1d62687aa6af6f01f",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174a603aef1d62687aa6af6f01f",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178a603aef1d62687aa6af6f01f",
              "width": 160
            }
          ],
          "name": "Drakeo the Ruler",
          "popularity": 65,
          "type": "artist",
          "uri": "spotify:artist:0p4ViyfJUTW0IT4SCBLexf"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/29ijED2bnnprp2TciAK1aO"
          },
          "followers": {
            "href": null,
            "total": 80470
          },
          "genres": [
            "contemporary country"
          ],
          "href": "https://api.spotify.com/v1/artists/29ijED2bnnprp2TciAK1aO",
          "id": "29ijED2bnnprp2TciAK1aO",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb3af491f459fac4d1940d1313",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab676161000051743af491f459fac4d1940d1313",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f1783af491f459fac4d1940d1313",
              "width": 160
            }
          ],
          "name": "Drake White",
          "popularity": 56,
          "type": "artist",
          "uri": "spotify:artist:29ijED2bnnprp2TciAK1aO"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/5c3GLXai8YOMid29ZEuR9y"
          },
          "followers": {
            "href": null,
            "total": 585325
          },
          "genres": [
            "british folk",
            "folk",
            "folk rock",
            "indie folk",
            "melancholia",
            "rock",
            "singer-songwriter"
          ],
          "href": "https://api.spotify.com/v1/artists/5c3GLXai8YOMid29ZEuR9y",
          "id": "5c3GLXai8YOMid29ZEuR9y",
          "images": [
            {
              "height": 1484,
              "url": "https://i.scdn.co/image/d364b498f85ae764cd278fbba9a8ed7f00c3e434",
              "width": 1000
            },
            {
              "height": 950,
              "url": "https://i.scdn.co/image/087fb05851e498c2791ca99000acf35b0fd49f19",
              "width": 640
            },
            {
              "height": 297,
              "url": "https://i.scdn.co/image/9a74a7d885abe5da94ac812546d0146cfe4a1ceb",
              "width": 200
            },
            {
              "height": 95,
              "url": "https://i.scdn.co/image/267080662cf3c019ea8020a4e0e8dd5a7be4d909",
              "width": 64
            }
          ],
          "name": "Nick Drake",
          "popularity": 64,
          "type": "artist",
          "uri": "spotify:artist:5c3GLXai8YOMid29ZEuR9y"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/03ilIKH0i08IxmjKcn63ne"
          },
          "followers": {
            "href": null,
            "total": 354179
          },
          "genres": [
            "post-teen pop"
          ],
          "href": "https://api.spotify.com/v1/artists/03ilIKH0i08IxmjKcn63ne",
          "id": "03ilIKH0i08IxmjKcn63ne",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5ebf022697d475649654541eecc",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174f022697d475649654541eecc",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178f022697d475649654541eecc",
              "width": 160
            }
          ],
          "name": "Drake Bell",
          "popularity": 54,
          "type": "artist",
          "uri": "spotify:artist:03ilIKH0i08IxmjKcn63ne"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/0Y5tJX1MQlPlqiwlOH1tJY"
          },
          "followers": {
            "href": null,
            "total": 18879440
          },
          "genres": [
            "rap",
            "slap house"
          ],
          "href": "https://api.spotify.com/v1/artists/0Y5tJX1MQlPlqiwlOH1tJY",
          "id": "0Y5tJX1MQlPlqiwlOH1tJY",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5ebe707b87e3f65997f6c09bfff",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174e707b87e3f65997f6c09bfff",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178e707b87e3f65997f6c09bfff",
              "width": 160
            }
          ],
          "name": "Travis Scott",
          "popularity": 94,
          "type": "artist",
          "uri": "spotify:artist:0Y5tJX1MQlPlqiwlOH1tJY"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/0onYmFlLt2WsFEL5YzEhEz"
          },
          "followers": {
            "href": null,
            "total": 43
          },
          "genres": [],
          "href": "https://api.spotify.com/v1/artists/0onYmFlLt2WsFEL5YzEhEz",
          "id": "0onYmFlLt2WsFEL5YzEhEz",
          "images": [],
          "name": "Drakeo The Ruler",
          "popularity": 37,
          "type": "artist",
          "uri": "spotify:artist:0onYmFlLt2WsFEL5YzEhEz"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/0QHgL1lAIqAw0HtD7YldmP"
          },
          "followers": {
            "href": null,
            "total": 6628085
          },
          "genres": [
            "hip hop",
            "miami hip hop",
            "pop",
            "pop rap",
            "rap",
            "southern hip hop",
            "trap"
          ],
          "href": "https://api.spotify.com/v1/artists/0QHgL1lAIqAw0HtD7YldmP",
          "id": "0QHgL1lAIqAw0HtD7YldmP",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5ebbf921114b7f19be97ce29647",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174bf921114b7f19be97ce29647",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178bf921114b7f19be97ce29647",
              "width": 160
            }
          ],
          "name": "DJ Khaled",
          "popularity": 81,
          "type": "artist",
          "uri": "spotify:artist:0QHgL1lAIqAw0HtD7YldmP"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/4OBEXKiH8BvUmMaAwW9ZUN"
          },
          "followers": {
            "href": null,
            "total": 9
          },
          "genres": [],
          "href": "https://api.spotify.com/v1/artists/4OBEXKiH8BvUmMaAwW9ZUN",
          "id": "4OBEXKiH8BvUmMaAwW9ZUN",
          "images": [],
          "name": "Drakeo The Ruler",
          "popularity": 35,
          "type": "artist",
          "uri": "spotify:artist:4OBEXKiH8BvUmMaAwW9ZUN"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/7rvB7ONJSqlmaCrcbhelir"
          },
          "followers": {
            "href": null,
            "total": 8532
          },
          "genres": [
            "la pop"
          ],
          "href": "https://api.spotify.com/v1/artists/7rvB7ONJSqlmaCrcbhelir",
          "id": "7rvB7ONJSqlmaCrcbhelir",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb51e4f176590eb53ad702f404",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab6761610000517451e4f176590eb53ad702f404",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f17851e4f176590eb53ad702f404",
              "width": 160
            }
          ],
          "name": "Jamie Drake",
          "popularity": 45,
          "type": "artist",
          "uri": "spotify:artist:7rvB7ONJSqlmaCrcbhelir"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/1RyvyyTE3xzB2ZywiAwp0i"
          },
          "followers": {
            "href": null,
            "total": 10802419
          },
          "genres": [
            "atl hip hop",
            "hip hop",
            "pop rap",
            "rap",
            "southern hip hop",
            "trap"
          ],
          "href": "https://api.spotify.com/v1/artists/1RyvyyTE3xzB2ZywiAwp0i",
          "id": "1RyvyyTE3xzB2ZywiAwp0i",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb38c1a72909cb7dd8e2a1f30d",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab6761610000517438c1a72909cb7dd8e2a1f30d",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f17838c1a72909cb7dd8e2a1f30d",
              "width": 160
            }
          ],
          "name": "Future",
          "popularity": 91,
          "type": "artist",
          "uri": "spotify:artist:1RyvyyTE3xzB2ZywiAwp0i"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/55Aa2cqylxrFIXC767Z865"
          },
          "followers": {
            "href": null,
            "total": 11097494
          },
          "genres": [
            "hip hop",
            "new orleans rap",
            "pop rap",
            "rap",
            "trap"
          ],
          "href": "https://api.spotify.com/v1/artists/55Aa2cqylxrFIXC767Z865",
          "id": "55Aa2cqylxrFIXC767Z865",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5ebc63aded6f4bf4d06d1377106",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174c63aded6f4bf4d06d1377106",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178c63aded6f4bf4d06d1377106",
              "width": 160
            }
          ],
          "name": "Lil Wayne",
          "popularity": 90,
          "type": "artist",
          "uri": "spotify:artist:55Aa2cqylxrFIXC767Z865"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/5M7hCkA0s91a3BqfktxLfK"
          },
          "followers": {
            "href": null,
            "total": 4612
          },
          "genres": [
            "christian indie"
          ],
          "href": "https://api.spotify.com/v1/artists/5M7hCkA0s91a3BqfktxLfK",
          "id": "5M7hCkA0s91a3BqfktxLfK",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5ebfeca4e21881d405efcf3231b",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174feca4e21881d405efcf3231b",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178feca4e21881d405efcf3231b",
              "width": 160
            }
          ],
          "name": "Drakeford",
          "popularity": 34,
          "type": "artist",
          "uri": "spotify:artist:5M7hCkA0s91a3BqfktxLfK"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/3KLA7mvD10XxcjRbo3uTdB"
          },
          "followers": {
            "href": null,
            "total": 10256
          },
          "genres": [
            "scorecore",
            "soundtrack",
            "video game music"
          ],
          "href": "https://api.spotify.com/v1/artists/3KLA7mvD10XxcjRbo3uTdB",
          "id": "3KLA7mvD10XxcjRbo3uTdB",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b273fded328c6ba87b43251c5abb",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/ab67616d00001e02fded328c6ba87b43251c5abb",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/ab67616d00004851fded328c6ba87b43251c5abb",
              "width": 64
            }
          ],
          "name": "Christopher Drake",
          "popularity": 41,
          "type": "artist",
          "uri": "spotify:artist:3KLA7mvD10XxcjRbo3uTdB"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/5f7VJjfbwm532GiveGC0ZK"
          },
          "followers": {
            "href": null,
            "total": 8673013
          },
          "genres": [
            "atl hip hop",
            "atl trap",
            "rap",
            "trap"
          ],
          "href": "https://api.spotify.com/v1/artists/5f7VJjfbwm532GiveGC0ZK",
          "id": "5f7VJjfbwm532GiveGC0ZK",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb2161ef3bab0e5e922a1c297d",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab676161000051742161ef3bab0e5e922a1c297d",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f1782161ef3bab0e5e922a1c297d",
              "width": 160
            }
          ],
          "name": "Lil Baby",
          "popularity": 93,
          "type": "artist",
          "uri": "spotify:artist:5f7VJjfbwm532GiveGC0ZK"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/6ZHXjIaTeFamrqlcfWYvbC"
          },
          "followers": {
            "href": null,
            "total": 14
          },
          "genres": [],
          "href": "https://api.spotify.com/v1/artists/6ZHXjIaTeFamrqlcfWYvbC",
          "id": "6ZHXjIaTeFamrqlcfWYvbC",
          "images": [],
          "name": "Drakeo the Ruler",
          "popularity": 29,
          "type": "artist",
          "uri": "spotify:artist:6ZHXjIaTeFamrqlcfWYvbC"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/2y7pPMQioLwMFUKhK9Pyow"
          },
          "followers": {
            "href": null,
            "total": 8121
          },
          "genres": [
            "british singer-songwriter"
          ],
          "href": "https://api.spotify.com/v1/artists/2y7pPMQioLwMFUKhK9Pyow",
          "id": "2y7pPMQioLwMFUKhK9Pyow",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5ebac9220c075a8d2ade93f1a17",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174ac9220c075a8d2ade93f1a17",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178ac9220c075a8d2ade93f1a17",
              "width": 160
            }
          ],
          "name": "Eleni Drake",
          "popularity": 43,
          "type": "artist",
          "uri": "spotify:artist:2y7pPMQioLwMFUKhK9Pyow"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/20sxb77xiYeusSH8cVdatc"
          },
          "followers": {
            "href": null,
            "total": 5558770
          },
          "genres": [
            "hip hop",
            "philly rap",
            "pop rap",
            "rap",
            "southern hip hop",
            "trap"
          ],
          "href": "https://api.spotify.com/v1/artists/20sxb77xiYeusSH8cVdatc",
          "id": "20sxb77xiYeusSH8cVdatc",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb238b2a30c741d42a4c91b7b7",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab67616100005174238b2a30c741d42a4c91b7b7",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f178238b2a30c741d42a4c91b7b7",
              "width": 160
            }
          ],
          "name": "Meek Mill",
          "popularity": 84,
          "type": "artist",
          "uri": "spotify:artist:20sxb77xiYeusSH8cVdatc"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/6ngQXmcwKjGqfKIxpuevPm"
          },
          "followers": {
            "href": null,
            "total": 4
          },
          "genres": [],
          "href": "https://api.spotify.com/v1/artists/6ngQXmcwKjGqfKIxpuevPm",
          "id": "6ngQXmcwKjGqfKIxpuevPm",
          "images": [],
          "name": "Drakeo the Ruler",
          "popularity": 27,
          "type": "artist",
          "uri": "spotify:artist:6ngQXmcwKjGqfKIxpuevPm"
        },
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/2HPaUgqeutzr3jx5a9WyDV"
          },
          "followers": {
            "href": null,
            "total": 3355849
          },
          "genres": [
            "pop",
            "pop rap",
            "r&b",
            "rap",
            "toronto rap",
            "trap",
            "urban contemporary"
          ],
          "href": "https://api.spotify.com/v1/artists/2HPaUgqeutzr3jx5a9WyDV",
          "id": "2HPaUgqeutzr3jx5a9WyDV",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab6761610000e5eb4e3dee8baac75dad1fea791e",
              "width": 640
            },
            {
              "height": 320,
              "url": "https://i.scdn.co/image/ab676161000051744e3dee8baac75dad1fea791e",
              "width": 320
            },
            {
              "height": 160,
              "url": "https://i.scdn.co/image/ab6761610000f1784e3dee8baac75dad1fea791e",
              "width": 160
            }
          ],
          "name": "PARTYNEXTDOOR",
          "popularity": 80,
          "type": "artist",
          "uri": "spotify:artist:2HPaUgqeutzr3jx5a9WyDV"
        }
      ],
      "limit": 20,
      "next": "https://api.spotify.com/v1/search?query=drake&type=artist&offset=20&limit=20",
      "offset": 0,
      "previous": null,
      "total": 934
    }
}



const APIController = (function() {

    //Our client credentials
    const client_id = '114395066cda41339bf88ac498593f3b';
    const client_secret = 'f983dc34a52542219c89ce6835278093';
  
    const _getToken = async () => {
  
      const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/x-www-form-urlencoded', 
              'Authorization' : 'Basic ' + btoa('114395066cda41339bf88ac498593f3b' + ':' + 'f983dc34a52542219c89ce6835278093')
          },
          body: 'grant_type=client_credentials'
      });
  
      const data = await result.json();
      return data.access_token;
    }
  
      
    const _getGenres = async (token) => {
  
      const result = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });
  
      const data = await result.json();
      return data.genres;
  }
  
  const _getRecommendations = async (token, artistIDs, genres, trackIDs) => {
  
      const limit = 10;
      
      const result = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_artists=${artistIDs}&seed_genres=${genres}&seed_tracks=${trackIDs}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });
  
      const data = await result.json();
      return data.recommendations.items;
  }
  
  
  
  return {
      getToken() {
          return _getToken();
      },
      getGenres(token) {
          return _getGenres(token);
      },
      getRecommendations(token, artistIDs, genres, trackIDs) {
          return _getRecommendations(token, artistIDs, genres, trackIDs);
      },
      getTracks(token, tracksEndPoint) {
          return _getTracks(token, tracksEndPoint);
      },
      getTrack(token, trackEndPoint) {
          return _getTrack(token, trackEndPoint);
      }
  }
  })();
  
  
  
  