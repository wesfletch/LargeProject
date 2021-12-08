import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import SongTable from '../components/SongTable';

function EditPlaylist()
{
    const doAddSongs = async event =>
    {
        window.location.href = '/addSongs';
    };
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="edit-playlist" />
            <div class="container-center-horizontal">
            <div class="edit-playlist screen">
                <div class="overlap-group-container">
                <div class="overlap-group2">
                    <div class="sidebar"></div>
                    <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <NavigationBar/>
                    </div>
                </div>
                <div class="overlap-group1 border-1px-black-3">
                    <div class="edit-playlist-1 oswald-normal-black-40px">Edit Playlist</div>
                    <div class="rectangle-50"></div>
                    <div class="songs oswald-normal-black-30px">Songs</div>
                    <div class="rectangle-55-1">
                        <SongTable/>
                    </div>
                    <div class="button">
                        <Button variant='signInBtn' size="big" onClick={doAddSongs}>
                            Add Songs
                        </Button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default EditPlaylist;