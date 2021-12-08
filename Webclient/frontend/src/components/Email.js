import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Email()
{
    var code;
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/verify/';
        }
        else
        {
            return 'http://localhost:5000/users/verify/';
        }
    }

    const doVerify = async event =>
    {
        event.preventDefault();
        try
        {
            const response = await fetch(getPath() + code.value, {method:'PUT',credentials: 'include',headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (!res.message.msgError)
            {
                //const responsed = await fetch(getOtherPath(), {method:'GET',credentials: 'include',headers:{'Content-Type':'application/json'}});
                //var resed = JSON.parse(await responsed.text());
                //alert(resed.user.display_name);
                //alert("access_token=" + res.token);
                //document.cookie = "access_token=" + res.token;
                //localStorage.setItem('token', res.token);
                window.location.href = '/';
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
            <input type="hidden" id="anPageName" name="page" value="registration" />
            <div class="container-center-horizontal">
            <div class="registration screen">
                <div class="overlap-group1">
                <div class="overlap-group">
                    <img class="car-3075497_1280-1"/>
                    <div class="background border-1px-black"></div>
                </div>
                <div class="copyright oswald-normal-white-17px">©2020 ACME LLC.</div>
                <div class="button">
                    <Button variant='signInBtn' size="big" onClick={doVerify}>
                        Verify
                    </Button>
                </div>
                <div class="display-name">
                    <div class="genres-1 oswald-normal-black-30px">Verification Code From Email</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="Paste code here" ref={(c) => code = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="registration-1 oswald-normal-black-40px">Email Verification</div>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Email;