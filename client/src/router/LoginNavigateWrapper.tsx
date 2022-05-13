import React, {useContext} from 'react'
import {useLocation, useNavigate, Navigate} from "react-router-dom";
import {MainContext} from "../index";

export {} from 'react-router-dom'

export const LoginNavigateWrapper = ({children}: { children: JSX.Element }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const {user} = useContext(MainContext)

    // @ts-ignore
    const from = location.state?.from?.pathname || '/'
    console.log(from)

    return user.isAuth ? <Navigate to={from}/> : children
}