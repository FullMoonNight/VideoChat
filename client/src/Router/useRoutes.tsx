import React, {useContext} from 'react'
import {Route, Routes, Navigate} from "react-router-dom";
import {LoginPage} from "../pages/LoginPage";
import {MainContext} from "../index";
import {MainViewPage} from "../pages/MainViewPage";
import {UserAccountSettingsPanel} from "../components/main-view/settings-panel/UserAccountSettingsPanel";

export function useRoutes() {
    const {user} = useContext(MainContext)

    if (!user.isAuth) {
        return (
            <Routes>
                <Route path='login' element={<LoginPage/>}/>
                <Route path='*' element={<Navigate to='login'/>}/>
            </Routes>
        )
    } else {
        return (
            <Routes>
                <Route path='/main' element={<MainViewPage/>}>
                    <Route path='settings' element={<UserAccountSettingsPanel/>}/>
                </Route>
                <Route path='*' element={<Navigate to='main'/>}/>
            </Routes>
        )
    }
}