import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import PlaylistTable from '../components/PlaylistTable';
import NavigationBar from '../components/NavigationBar';

function Home()
{
    const [displayName, setDisplayName] = useState(null);
    function getOtherPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/authenticated';
        }
        else
        {
            return 'http://localhost:5000/users/authenticated';
        }
    }
    useEffect(() => {
        async function getDisplayName() {
            let response = await fetch(getOtherPath(), {method:'GET',credentials:'include',headers:{'Content-Type':'application/json'}});
            response = await response.json();
            setDisplayName(response.user.display_name);
        }
        getDisplayName();
    }, []);
    if (displayName == null)
    {
        return null;
    }
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
                    <NavigationBar/>
                    </div>
                </div>
                <div class="overlap-group1 border-1px-black-3">
                    <div class="welcome-display-name oswald-normal-black-40px">Welcome {displayName}</div>
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