import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

function Recommend()
{
    var artist, song, genre;
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/fetch/recspipe';
        }
        else
        {
            return 'http://localhost:5000/fetch/recspipe';
        }
    }

    const doRecommend = async event =>
    {
        event.preventDefault();
        var obj = {artists:[artist.value], tracks:[song.value], genres:[genre.value]};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'POST',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = await response.text();
            //alert(res);
            //alert('testa');
            localStorage.setItem("rec", res);
            //alert('test');
            window.location.href = '/recList';
        }
        catch(e)
        {
            alert(js + e.toString());
            return;
        }
    };
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="recommend-songs" />
            <div class="container-center-horizontal">
            <div class="recommend-songs screen">
                <div class="overlap-group-container">
                <div class="overlap-group2">
                    <div class="sidebar"></div>
                    <div class="menu">
                    <img class="marker" src="img/marker@2x.svg" />
                    <NavigationBar/>
                    </div>
                </div>
                <div class="overlap-group1">
                    <h1 class="title">Recommend Songs</h1>
                    <div class="rectangle-50"></div>
                    <div class="songs-recommended-by">Songs Recommended By You and Your Friend’s Favorites</div>
                    <div class="which-friend-would-y oswald-normal-black-20px">
                    Which friend would you like to collaborate with?
                    </div>
                    <div class="rectangle-55-1"></div>
                    <div class="recommend-songs-button">
                        <Button variant='signInBtn' size="big">
                        Recommend Songs
                        </Button>
                    </div>
                    <img class="line-1" src="img/line-1@1x.svg" />
                    <div class="customize-your-recommended">Customize Your Recommended</div>
                    <div class="flex-row">
                    <div class="overlap-group3">
                        <div class="input-field">
                        <div class="artist oswald-normal-black-20px">Input any artist</div>
                        <div class="rectangle-55">
                            <Form>
                                <Form.Group class="formElement">
                                    <Form.Control type="text" placeholder="" ref={(c) => artist = c}/>
                                </Form.Group>
                            </Form>
                        </div>
                        </div>
                    </div>
                    <div class="flex-col-1">
                        <div class="overlap-group5">
                        <div class="input-field">
                            <div class="songs oswald-normal-black-20px">Input any song</div>
                            <div class="rectangle-55">
                                <Form>
                                    <Form.Group class="formElement">
                                        <Form.Control type="text" placeholder="" ref={(c) => song = c}/>
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>
                        </div>
                        <div class="recommend-songs-customize-button">
                            <Button variant='signInBtn' size="big" onClick={doRecommend}>
                            Recommend Songs
                            </Button>
                        </div>
                    </div>
                    <div class="overlap-group4">
                        <div class="input-field">
                        <div class="songs-1 oswald-normal-black-20px">Input any genre</div>
                        <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="" ref={(c) => genre = c}/>
                            </Form.Group>
                        </Form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Recommend;