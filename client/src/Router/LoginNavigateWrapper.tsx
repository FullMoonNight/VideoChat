import React, {useContext} from 'react'
import {useLocation, useNavigate, Navigate} from "react-router-dom";
import {MainContext} from "../index";

export {} from 'react-router-dom'

export const LoginNavigateWrapper = ({children}: { children: JSX.Element }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const {auth} = useContext(MainContext)

    // @ts-ignore
    const from = location.state?.from?.pathname || '/'
    console.log(from)

    return auth.isAuth ? <Navigate to={from}/> : children
}