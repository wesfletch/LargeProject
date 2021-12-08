import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import RecListTable from '../components/RecListTable';
import NavigationBar from '../components/NavigationBar';

function RecList()
{
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="list-of-recommended-songs" />
            <div class="container-center-horizontal">
            <div class="list-of-recommended-songs screen">
                <div class="overlap-group">
                <img class="shutterstock_1222007797-1" src="img/shutterstock-1222007797-1@1x.png" />
                <div class="sidebar"></div>
                <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <NavigationBar/>
                </div>
                <div class="background-box border-1px-black"></div>
                <div class="button-create-new-playlist">
                    <div class="new-playlist oswald-normal-black-30px-2">Create Playlist</div>
                </div>
                <div class="rectangle-56"></div>
                <div class="enter-playllist-name oswald-normal-black-20px">Enter Playllist Name</div>
                <div class="or">OR</div>
                <div class="button-add-to-a-new-playlist">
                    <div class="existing-playlist oswald-normal-black-30px">Add Songs to an Existing Playlist</div>
                </div>
                <div class="what-would-you-like oswald-normal-black-30px">What would you like to do with these songs?</div>
                <div class="rectangle-55">
                    <RecListTable/>
                </div>
                <div class="choose-your-songs oswald-normal-black-30px">Your Recommended Songs</div>
                <div class="rectangle-50"></div>
                <div class="based-on-your-input oswald-normal-black-40px">
                    Based on your input, here’s a list of songs we recommend
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default RecList;