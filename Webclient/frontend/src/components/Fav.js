import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Fav()
{
    var artist, song, genre;
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

    const doFav = async event =>
    {
        event.preventDefault();
        var obj = {fav_artists:[artist.value], fav_tracks:[song.value], fav_genres:[genre.value]};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'PUT',credentials: 'include', body:js, headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (!res.message.msgError)
            {
                //const responsed = await fetch(getOtherPath(), {method:'GET',credentials: 'include',headers:{'Content-Type':'application/json'}});
                //var resed = JSON.parse(await responsed.text());
                //alert(resed.user.display_name);
                //alert("access_token=" + res.token);
                //document.cookie = "access_token=" + res.token;
                //localStorage.setItem('token', res.token);
                window.location.href = '/login';
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
            <input type="hidden" id="anPageName" name="page" value="redirect-page-after-email-verification" />
            <div class="container-center-horizontal">
            <div class="redirect-page-after-email-verification screen">
                <div class="overlap-group1">
                <div class="overlap-group">
                    <img class="car-3075497_1280-1" src="img/car-3075497-1280-1@1x.png" />
                    <div class="background border-1px-black"></div>
                </div>
                <div class="copyright oswald-normal-white-17px">©2020 ACME LLC.</div>
                <div class="enter-profile-button">
                    <Button variant='signInBtn' size="big" onClick={doFav}>
                        Enter Profile
                    </Button>
                </div>
                <div class="profile-form-labels-pass">
                    <div class="genres oswald-normal-black-30px">Favorite Genre</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="Rock" ref={(c) => genre = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="profile-form-labels-email">
                    <div class="songs oswald-normal-black-30px">Favorite Song</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="Sympathy For The Devil" ref={(c) => song = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="top-artists">
                    <div class="artists oswald-normal-black-30px">Favorite Artist</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="Rolling Stones" ref={(c) => artist = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="rectangle-50"></div>
                <div class="title-line oswald-normal-black-40px">
                    Almost Done! Enter Your Favorite Artists, Songs, and Genres
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Fav;