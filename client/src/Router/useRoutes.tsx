import React, {useContext} from 'react'
import {Route, Routes, Navigate} from "react-router-dom";
import {LoginPage} from "../pages/LoginPage";
import RequireAuthWrapper from "./RequireAuthWrapper";
import {LoginNavigateWrapper} from "./LoginNavigateWrapper";
import {MainContext} from "../index";
import {MainViewPage} from "../pages/MainViewPage";

export function useRoutes() {
    const {auth} = useContext(MainContext)

    if (!auth.isAuth) {
        return (
            <Routes>
                <Route path='login' element={<LoginPage/>}/>
                <Route path='*' element={<Navigate to='login'/>}/>
            </Routes>
        )
    } else {
        return (
            <Routes>
                <Route path='/main' element={<MainViewPage/>}/>
                <Route path='*' element={<Navigate to='main'/>}/>
            </Routes>
        )
    }
}