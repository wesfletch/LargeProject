import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Login()
{
    var email;
    var password;

    const doLogin = async event =>
    {
        event.preventDefault();
        alert("test" + email.value + password.value);
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
                        <a>Create account</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default Login;