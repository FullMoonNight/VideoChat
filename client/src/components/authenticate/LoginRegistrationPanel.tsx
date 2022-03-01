import React, {useContext, useState} from 'react';
import {LoginBlock} from "./LoginBlock";
import {RegistrationBlock} from "./RegistrationBlock";
import './LoginRegistration.css'
import AuthController from "../../controllers/AuthController";
import {MainContext} from "../../index";
import {observer} from "mobx-react-lite";

export const LoginRegistrationPanel = observer(() => {
    const {app} = useContext(MainContext)

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [panelMode, setPanelMode] = useState<'login' | 'registration'>('login');

    function usernameHandler(username: string) {
        setUsername(username)
    }

    function passwordHandler(password: string) {
        setPassword(password)
    }

    function emailHandler(email: string) {
        setEmail(email)
    }

    function togglePanelMode() {
        panelMode === "login" ? setPanelMode('registration') : setPanelMode("login")
    }

    async function submitForm() {
        app.appStartWaiting()
        if (panelMode === 'registration') {
            await AuthController.registration({username, email, password})
        } else if (panelMode === 'login') {
            await AuthController.login({email, password})
        }
        app.appEndWaiting()
    }

    return (
        <div className="auth-container">
            <div className="wrapper">
                <div className="auth-panel">
                    {
                        panelMode === 'registration' &&
                        <RegistrationBlock
                            usernameHandler={usernameHandler}
                            emailHandler={emailHandler}
                            passwordHandler={passwordHandler}
                            username={username}
                            email={email}
                            password={password}/>
                    }
                    {
                        panelMode === 'login' &&
                        <LoginBlock
                            emailHandler={emailHandler}
                            passwordHandler={passwordHandler}
                            email={email}
                            password={password}/>
                    }
                    <button onClick={submitForm} disabled={app.waiting}>
                        {panelMode === "login" ? "login" : "sign up"}
                    </button>
                </div>
                <div className="panel-switch">
                    <button onClick={togglePanelMode} disabled={app.waiting}>
                        {panelMode === "registration" ? "login" : "sing up"}
                    </button>
                </div>
            </div>

        </div>
    );
});