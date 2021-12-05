import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';

function CreatePlaylist()
{
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/addplaylist';
        }
        else
        {
            return 'http://localhost:5000/users/addplaylist';
        }
    }
    var name;
    const doCreatePlaylist = async event =>
    {
        event.preventDefault();
        var obj = {name:name.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'POST',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            //alert(res);
            window.location.href = '/home';
        }
        catch(e)
        {
            alert(js + e.toString() + document.cookie);
            return;
        }
    };
    return (
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <h1 class="signIn">Create a New Playlist</h1>
                    <div class="forms">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Best of Hamilton" ref={(c) => name = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    <div class="signIn">
                        <Button variant='signInBtn' size="big" onClick={doCreatePlaylist}>
                            Create Playlist
                        </Button>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default CreatePlaylist;