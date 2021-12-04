import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Home()
{
    const doCreatePlaylist = async event =>
    {
        window.location.href = '/createPlaylist';
    };
    return (
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <div class="guest">
                        <div className="d-grid gap-2">
                            <Button variant='welcomeBtn' size="bigG" onClick={doCreatePlaylist}>
                                Create a New Playlist
                            </Button>
                            <Button variant='welcomeBtn' size="bigG">
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