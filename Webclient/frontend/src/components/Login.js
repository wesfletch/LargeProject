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
        //alert("test" + email.value + password.value);
        var obj = {email:email.value, password:password.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(getPath(), {method:'POST',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.isAuthenticated)
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
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <h1 class="signIn">Sign In</h1>
                    <div class="forms">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="email" placeholder="123@gmail.com" ref={(c) => email = c}/>
                            </Form.Group>
                        </Form>
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password here" ref={(c) => password = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    <div class="signIn">
                        <Button variant='signInBtn' size="big" onClick={doLogin}>
                            Sign In
                        </Button>
                    </div>
                    <div class="noAccount">
                        <Form.Label>Don't have an account?</Form.Label>
                    </div>
                    <div class="guest">
                        <Button variant='guestBtn' size="bigG">
                            Continue as guest
                        </Button>
                    </div>
                    <div class="links">
                        <Link to={'/register'}>Create Account</Link>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default Login;