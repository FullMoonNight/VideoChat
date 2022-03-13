import React, {useContext, useEffect} from 'react';
import {AsidePanel} from "./main-view-aside/AsidePanel";
import AuthController from "../../controllers/AuthController";
import {MainContext} from "../../index";
import ProfileSettingsController from "../../controllers/ProfileSettingsController";
import {observer} from "mobx-react-lite";

export const MainView = observer(() => {
    const {app, profile} = useContext(MainContext)

    useEffect(() => {
        app.appStartLoading()
        !profile.loaded && ProfileSettingsController.getProfileSettings().then(res => app.appEndLoading())
    }, [])

    return (
        <AsidePanel/>
    );
});