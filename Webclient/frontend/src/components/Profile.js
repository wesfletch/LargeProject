import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

function Profile()
{
    var displayName, email, password, song, artist, genre;
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/update';
        }
        else
        {
            return 'http://localhost:5000/users/update';
        }
    }
    const doUpdate = async event =>
    {
        event.preventDefault();
        //alert(email.value.length);
        var obj = {};
        if (displayName.value.length > 0)
        {
            obj.display_name = displayName.value;
        }
        if (email.value.length > 0)
        {
            obj.email = email.value;
        }
        if (password.value.length > 0)
        {
            obj.password = password.value;
            obj.password2 = password.value;
        }
        if (genre.value.length > 0)
        {
            obj.fav_genres = [genre.value];
        }
        if (artist.value.length > 0)
        {
            obj.fav_artists = [artist.value];
        }
        if (song.value.length > 0)
        {
            obj.fav_tracks = [song.value];
        }
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'PUT',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (!res.message.msgError)
            {
                //alert("access_token=" + res.token);
                //document.cookie = "access_token=" + res.token;
                //localStorage.setItem('token', res.token);
                window.location.href = '/home';
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
            <input type="hidden" id="anPageName" name="page" value="profile" />
            <div class="container-center-horizontal">
            <div class="profile screen">
                <div class="overlap-group-container">
                <div class="overlap-group2">
                    <div class="sidebar"></div>
                    <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <NavigationBar/>
                    </div>
                </div>
                <div class="overlap-group1 border-1px-black-3">
                    <div class="favorite-artists oswald-normal-black-40px">Your Profile</div>
                    <div class="rectangle-50"></div>
                    <div class="profile-form-labels-1">
                    <div class="display-name oswald-normal-black-30px">Display Name</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="" ref={(c) => displayName = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                    <div class="profile-form-labels">
                    <div class="email oswald-normal-black-30px">Email</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="email" placeholder="" ref={(c) => email = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                    <div class="profile-form-labels">
                    <div class="password oswald-normal-black-30px">Password</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="password" placeholder="" ref={(c) => password = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                    <div class="profile-form-labels">
                    <div class="top-songs oswald-normal-black-30px">Favorite Song</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="" ref={(c) => song = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                    <div class="profile-form-labels">
                    <div class="display-name-1 oswald-normal-black-30px">Favorite Artist</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="" ref={(c) => artist = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                    <div class="profile-form-labels">
                    <div class="favorite-genres oswald-normal-black-30px">Favorite Genre</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="" ref={(c) => genre = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                    <div class="button">
                        <Button variant='signInBtn' size="big" onClick={doUpdate}>
                            Confirm Changes to Profile
                        </Button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Profile;