import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Login()
{
    return (
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <div class="signIn">
                        <h1>Sign In</h1>
                    </div>
                    <div class="forms">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="email" placeholder="123@gmail.com"/>
                            </Form.Group>
                        </Form>
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password here"/>
                            </Form.Group>
                        </Form>
                    </div>
                    <div class="signIn">
                        <Button variant='signInBtn' size="big">
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default Login;