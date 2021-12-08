import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import FriendTable from '../components/FriendTable';
import NavigationBar from '../components/NavigationBar';

function Friends()
{
    const goAddFriend = async event =>
    {
        window.location.href = '/addFriend';
    };
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="friends" />
            <div class="container-center-horizontal">
            <div class="friends screen">
                <div class="overlap-group-container">
                <div class="overlap-group2">
                    <div class="sidebar"></div>
                    <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <NavigationBar/>
                    </div>
                </div>
                <div class="overlap-group1 border-1px-black-3">
                    <div class="friends-2 oswald-normal-black-40px">Friends</div>
                    <div class="rectangle-50"></div>
                    <div class="rectangle-55">
                        <FriendTable/>
                    </div>
                    <div class="button">
                        <Button variant='signInBtn' size="big" onClick={goAddFriend}>
                            Add Friend
                        </Button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Friends;