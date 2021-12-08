import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';

function NavigationBar()
{
    const goHome = async event =>
    {
        window.location.href = '/home';
    };
    const goProfile = async event =>
    {
        window.location.href = '/profile';
    };
    const goRecommend = async event =>
    {
        window.location.href = '/rec';
    };
    const goFriends = async event =>
    {
        window.location.href = '/friends';
    };
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
            if (!res.message.msgError)
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
        <div class="flex-col">
            <div class="place oswald-normal-lilac-bush-17px">
                <Button variant='welcomeBtn' size="biggish" onClick={goHome}>
                    Home
                </Button>
            </div>
            <div class="welcomeBtn oswald-normal-white-17px">
                <Button variant='welcomeBtn' size="biggish" onClick={doCreatePlaylist}>
                    Create New Playlist
                </Button>
            </div>
            <div class="profile oswald-normal-white-17px">
                <Button variant='welcomeBtn' size="biggish" onClick={goRecommend}>
                    Recommend Songs
                </Button>
            </div>
            <div class="profile oswald-normal-white-17px">
                <Button variant='welcomeBtn' size="biggish" onClick={goFriends}>
                    Friends
                </Button>
            </div>
            <div class="profile oswald-normal-white-17px">
                <Button variant='welcomeBtn' size="biggish" onClick={goProfile}>
                    Profile
                </Button>
            </div>
            <div class="logout oswald-normal-white-17px">
                <Button variant='welcomeBtn' size="biggish" onClick={doLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default NavigationBar;