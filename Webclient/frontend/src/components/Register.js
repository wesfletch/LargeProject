import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Register()
{
    var email, password, password2, displayName;
    return (
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <h1 class="signIn">Register</h1>
                    <div class="forms">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="123@gmail.com" ref={(c) => email = c}/>
                            </Form.Group>
                        </Form>
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password here" ref={(c) => password = c}/>
                            </Form.Group>
                        </Form>
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password here" ref={(c) => password2 = c}/>
                            </Form.Group>
                        </Form>
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter password here" ref={(c) => displayName = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                    <div class="signIn">
                        <Button variant='signInBtn' size="big">
                            Register
                        </Button>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default Register;