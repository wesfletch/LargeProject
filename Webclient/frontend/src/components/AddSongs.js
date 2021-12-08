import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

function AddSongs()
{
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/fetch/track';
        }
        else
        {
            return 'http://localhost:5000/fetch/track';
        }
    }
    function getOtherPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/addtrack';
        }
        else
        {
            return 'http://localhost:5000/users/addtrack';
        }
    }
    var song;
    const addToPlaylist = async event =>
    {
        event.preventDefault();
        var obj = {track:song.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'POST',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            //alert(res[0].name);
            var o = {"playlist_id":localStorage.getItem("playlist"), "tracks":[{
            "name": res[0].name,
            "id": res[0].id,
            "artist": res[0].artist,
            "preview": res[0].preview,
            "url_link": res[0].url_link}]};
            var j = JSON.stringify(o);
            //alert(j);
            try
            {
                const response = await fetch(getOtherPath(), {method:'PUT',credentials: 'include', body:j,headers:{'Content-Type':'application/json'}});
                var res = JSON.parse(await response.text());
                if (!res.message.msgError)
                {
                    //alert("success");
                }
            }
            catch(ee)
            {
                alert(j + ee.toString());
                return;
            }
        }
        catch(e)
        {
            alert(js + e.toString());
            return;
        }
    };
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="add-to-an-existing-playlist" />
            <div class="container-center-horizontal">
            <div class="add-to-an-existing-playlist screen">
                <div class="overlap-group-container">
                <div class="overlap-group2">
                    <div class="sidebar"></div>
                    <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <NavigationBar/>
                    </div>
                </div>
                <div class="overlap-group1 border-1px-black-3">
                    <div class="playlists oswald-normal-black-40px">Add Songs</div>
                    <div class="rectangle-50"></div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="Mr. Blue Sky" ref={(c) => song = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    <div class="button">
                    <Button variant='signInBtn' size="big" onClick={addToPlaylist}>
                        Add to Playlist
                    </Button>
                </div>
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default AddSongs;