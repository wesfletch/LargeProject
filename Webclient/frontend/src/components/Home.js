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
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <PlaylistTable/>
                    <div class="guest">
                        <div className="d-grid gap-2">
                            <Button variant='welcomeBtn' size="bigG" onClick={doCreatePlaylist}>
                                Create a New Playlist
                            </Button>
                            <Button variant='welcomeBtn' size="bigG" onClick={doLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default Home;