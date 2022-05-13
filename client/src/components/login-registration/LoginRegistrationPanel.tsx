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

    async function submitForm(e: any) {
        e.preventDefault()
        if (app.waiting) return
        app.appStartWaiting()
        if (panelMode === 'registration') {
            await AuthController.registration({username, email, password})
        } else if (panelMode === 'login') {
            await AuthController.login({email, password})
        }
        app.appEndWaiting()
    }

    return (
        <>
            <div className="auth-registration-container">
                <div className={`container ${panelMode === 'login' ? 'right-panel-active' : ''}`}>
                    <div className="container__form container--signup">
                        {
                            panelMode === 'login' &&
                            <LoginBlock
                                emailHandler={emailHandler}
                                passwordHandler={passwordHandler}
                                email={email}
                                password={password}
                                submitForm={submitForm}/>
                        }
                    </div>
                    <div className="container__form container--signin">
                        {
                            panelMode === 'registration' &&
                            < RegistrationBlock
                                usernameHandler={usernameHandler}
                                emailHandler={emailHandler}
                                passwordHandler={passwordHandler}
                                username={username}
                                email={email}
                                password={password}
                                submitForm={submitForm}/>
                        }
                    </div>

                    <div className="container__overlay">
                        <div className="overlay">
                            <div className="overlay__panel overlay--left">
                                <button className="btn" onClick={togglePanelMode}>Sign Up</button>
                            </div>
                            <div className="overlay__panel overlay--right">
                                <button className="btn" onClick={togglePanelMode}>Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});