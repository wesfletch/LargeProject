import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import PlaylistTable from '../components/PlaylistTable';

function Home()
{
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/logout';
        }
        else
        {
            return 'http://localhost:5000/users/logout';
        }
    }
    const doCreatePlaylist = async event =>
    {
        window.location.href = '/createPlaylist';
    };
    const doLogout = async event =>
    {
        event.preventDefault();
        try
        {
            const response = await fetch(getPath(), {method:'GET',credentials:'include',headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.success)
            {
                window.location.href = '/';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="home-page" />
            <div class="container-center-horizontal">
            <div class="home-page screen">
                <div class="overlap-group-container">
                <div class="overlap-group2">
                    <div class="sidebar"></div>
                    <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <div class="flex-col">
                        <div class="place oswald-normal-lilac-bush-17px">HOME</div>
                        <div class="create-new-playlist oswald-normal-white-17px">
                            <Button variant='welcomeBtn' size="biggish" onClick={doCreatePlaylist}>
                                Create New Playlist
                            </Button>
                        </div>
                        <div class="recommend-songs oswald-normal-white-17px">Recommend Songs</div>
                        <div class="friends oswald-normal-white-17px">Friends</div>
                        <div class="profile oswald-normal-white-17px">Profile</div>
                        <div class="logout oswald-normal-white-17px">
                            <Button variant='welcomeBtn' size="biggish" onClick={doLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="overlap-group1 border-1px-black-3">
                    <div class="welcome-display-name oswald-normal-black-40px">Welcome “Display Name”</div>
                    <div class="rectangle-50"></div>
                    <div class="your-playlists oswald-normal-black-30px">Your Playlists</div>
                    <div class="rectangle-55">
                        <PlaylistTable/>
                    </div>
                    <img class="line-1" src="img/line-1@1x.svg" />
                    <div class="quick-recommend oswald-normal-black-40px">Quick Recommend</div>
                    <div class="button">
                    <div class="recommend-songs-1 oswald-normal-black-30px-2">Recommend Songs From Your Favorites</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Home;