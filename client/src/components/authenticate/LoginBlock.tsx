import React from 'react';

interface Props {
    emailHandler: (username: string) => void,
    passwordHandler: (password: string) => void,
    email: string,
    password: string,
}

export const LoginBlock = ({emailHandler, passwordHandler, email, password}: Props) => {
    return (
        <form>
            <h3>Login</h3>
            <div className="input-field">
                <input type="text" name="" id="email" required={true} value={email} onChange={(e) => emailHandler(e.target.value)}/>
                <label htmlFor="email">Email</label>
            </div>
            <div className="input-field">
                <input type="password" name="" id="password" required={true} value={password} onChange={(e) => passwordHandler(e.target.value)}/>
                <label htmlFor="password">Password</label>
            </div>
        </form>
    );
};