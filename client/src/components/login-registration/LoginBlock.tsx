import React from 'react';

interface Props {
    emailHandler: (username: string) => void,
    passwordHandler: (password: string) => void,
    email: string,
    password: string,
    submitForm: (event: any) => void
}

export const LoginBlock = ({emailHandler, passwordHandler, email, password, submitForm}: Props) => {
    return (
        <form action="#" className="form" id="form2">
            <h2 className="form__title">Sign In</h2>
            <input className="input" type="email" id="email" required={true} value={email} onChange={(e) => emailHandler(e.target.value)}/>
            <input className='input' type="password" id="password" required={true} value={password} onChange={(e) => passwordHandler(e.target.value)}/>
            <button className="btn" onClick={(e) => submitForm(e)}>Sign In</button>
        </form>
    );
};