import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Register()
{
    var email, password, password2, displayName;
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/register';
        }
        else
        {
            return 'http://localhost:5000/users/register';
        }
    }

    const doRegister = async event =>
    {
        event.preventDefault();
        var obj = {display_name:displayName.value, email:email.value, password:password.value, password2:password2.value};
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
                window.location.href = '/email';
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
            <input type="hidden" id="anPageName" name="page" value="registration" />
            <div class="container-center-horizontal">
            <div class="registration screen">
                <div class="overlap-group1">
                <div class="overlap-group">
                    <img class="car-3075497_1280-1" src="img/car-3075497-1280-1@1x.png" />
                    <div class="background border-1px-black"></div>
                </div>
                <div class="copyright oswald-normal-white-17px">©2020 ACME LLC.</div>
                <div class="button">
                    <Button variant='signInBtn' size="big" onClick={doRegister}>
                        Registration
                    </Button>
                </div>
                <div class="confirm-password">
                    <div class="genres oswald-normal-black-30px">Confirm Password</div>
                    <div class="rectangle-55">
                    <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="password" placeholder="Enter password here" ref={(c) => password2 = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="password">
                    <div class="songs oswald-normal-black-30px">Password</div>
                    <div class="rectangle-55">
                    <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="password" placeholder="Enter password here" ref={(c) => password = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="display-name">
                    <div class="genres-1 oswald-normal-black-30px">Display Name</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="text" placeholder="Enter display name here" ref={(c) => displayName = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="email">
                    <div class="artists oswald-normal-black-30px">Email</div>
                    <div class="rectangle-55">
                        <Form>
                            <Form.Group class="formElement">
                                <Form.Control type="email" placeholder="123@gmail.com" ref={(c) => email = c}/>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div class="rectangle-50"></div>
                <div class="registration-1 oswald-normal-black-40px">Registration</div>
                </div>
            </div>
            </div>
        </body>
    );
    /*return (
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
    );*/
};

export default Register;