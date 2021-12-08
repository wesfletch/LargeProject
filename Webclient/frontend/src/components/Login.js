import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';

function Login()
{
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/login';
        }
        else
        {
            return 'http://localhost:5000/users/login';
        }
    }
    var email;
    var password;

    const doLogin = async event =>
    {
        event.preventDefault();
        var obj = {email:email.value, password:password.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'POST',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (!res.message.msgError)
            {
                //const responsed = await fetch(getOtherPath(), {method:'GET',credentials: 'include',headers:{'Content-Type':'application/json'}});
                //var resed = JSON.parse(await responsed.text());
                //alert(resed.user.display_name);
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
            <input type="hidden" id="anPageName" name="page" value="login" />
            <div class="container-center-horizontal">
            <div class="login screen">
                <div class="overlap-group">
                <div class="background"></div>
                <div class="button">
                    <Button variant='signInBtn' size="big" onClick={doLogin}>
                        Sign In
                    </Button>
                </div>
                <div class="continue-as-guest">Continue As Guest</div>
                <div class="dont-have-an-account">Don’t have an account?</div>
                <div class="rectangle-58">
                    <Form>
                        <Form.Group class="formElement">
                            <Form.Control type="password" placeholder="Enter password here" ref={(c) => password = c}/>
                        </Form.Group>
                    </Form>
                </div>
                <div class="password">Password</div>
                <div class="rectangle-57">
                    <Form>
                        <Form.Group class="formElement">
                            <Form.Control type="email" placeholder="123@gmail.com" ref={(c) => email = c}/>
                        </Form.Group>
                    </Form>
                </div>
                <div class="e-mail">Email</div>
                <div class="log-in">Log in</div>
                <h1 class="title">Welcome To shareTunes</h1>
                </div>
            </div>
            </div>
        </body>
    );
};

export default Login;