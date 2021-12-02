import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function Home()
{
    return (
        <div class="row">
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
            <div class="col-lg-6 col-md-8 col-sm-10">
                <div class="mainForms">
                    <div class="guest">
                        <Button variant='guestBtn' size="bigG">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-2 col-sm-1"></div>
        </div>
    );
};

export default Home;