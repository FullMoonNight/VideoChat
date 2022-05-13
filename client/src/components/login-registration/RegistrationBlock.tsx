import React from 'react';

interface Props {
    usernameHandler: (username: string) => void,
    emailHandler: (email: string) => void,
    passwordHandler: (password: string) => void,
    username: string,
    email: string,
    password: string,
    submitForm: (event: any) => void
}

export const RegistrationBlock = ({usernameHandler, emailHandler, passwordHandler, username, email, password, submitForm}: Props) => {
    return (
        <form action="#" className="form" id="form1">
            <h2 className="form__title">Sign Up</h2>
            <input className='input' type="text" id="username" required={true} value={username} onChange={(e) => usernameHandler(e.target.value)}/>
            <input className='input' type="email" id="email" required={true} value={email} onChange={(e) => emailHandler(e.target.value)}/>
            <input className='input' type="password" id="password" required={true} value={password} onChange={(e) => passwordHandler(e.target.value)}/>
            <button className="btn" onClick={(e) => submitForm(e)}>Sign Up</button>
        </form>
    );
};