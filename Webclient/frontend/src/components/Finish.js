import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

function Finish()
{
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/reset/';
        }
        else
        {
            return 'http://localhost:5000/users/reset/';
        }
    }
    var song;
    var pw;
    const addToPlaylist = async event =>
    {
        event.preventDefault();
        var obj = {password:pw.value, password2:pw.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath() + song.value, {method:'PUT',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            window.location.href = '/';
        }
        catch(e)
        {
            alert(js + e.toString());
            return;
        }
    };
    return (
        <body class="bodies">
            <input type="hidden" id="anPageName" name="page" value="reset-password" />
            <div class="container-center-horizontal">
            <div class="reset-password screen">
                <div class="overlap-group">
                <div class="background-box"></div>
                <div class="button-create-new-playlist">
                <Button variant='signInBtn' size="big" onClick={addToPlaylist}>
                        Submit
                    </Button>
                </div>
                <div class="profile-form-labels-pass">
                    <div class="genres oswald-normal-black-20px">Input your token from email and password</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="123@gmail.com" ref={(c) => song = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="New Password" ref={(c) => pw = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    
                </div>
                <div class="reset-your-password">Reset Your Password</div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Finish;