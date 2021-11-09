exports.setApp = function (app, client)
{
    //load user model
    const User = require("./schema/user-schema.js");


    app.post('/api/register', async (req, res, next) =>
    {
        // incoming: email, password
        // //

    });

    app.post('/api/login', async (req, res, next) => 
    {
        // incoming : email, password(?)
        // outgoing : id, display_name, spotify_uri, access_token, refresh_token

        var error = '';

        // TODO: not sure how passwords are meant to be handled
        const { email } = req.body;

        const results = await User.find({ email: email });

        var ID = -1;
        var displayName = '';
        var spotifyURI = '';
        var access = '';
        var refresh = '';

        if ( results.length > 0)
        {
            console.log(results);
            ID              = results[0].ID;
            displayName     = results[0].display_name;
            spotifyURI      = results[0].spotify_uri;
            access          = results[0].access_token;
            refresh         = results[0].refresh_token;
        }

        var ret = { id:ID, display_name:displayName, spotify_uri:spotifyURI, access_token:access, refresh_token:refresh }
        
        res.status(200).json(ret);
    });
}

