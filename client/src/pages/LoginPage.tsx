import React from 'react';
import {LoginRegistrationPanel} from "../components/login-registration/LoginRegistrationPanel";
import {Link} from "react-router-dom";

export const LoginPage = () => (
    <>
        <LoginRegistrationPanel/>
        <Link to='main'>Main</Link>
    </>
)