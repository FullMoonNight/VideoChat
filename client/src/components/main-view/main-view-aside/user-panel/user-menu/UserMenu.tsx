import React, {useContext, useEffect} from 'react';
import './UserMenu.css'
import AuthController from "../../../../../controllers/AuthController";
import {WinContext} from "../../../../../pages/MainViewPage";
import {UserAccountSettingsPanel} from "../../../settings-panel/UserAccountSettingsPanel";

interface Props {
    setActive: (active: boolean) => void,
}

export const UserMenu = ({setActive}: Props) => {
    const {setContextWindow} = useContext(WinContext)

    useEffect(() => {
        const handler = () => {
            setActive(false)
        }
        document.getElementById('root')?.addEventListener('click', handler)
        return () => document.getElementById('root')?.removeEventListener('click', handler)
    }, [])

    const settingsHandler = () => {
        setContextWindow(<UserAccountSettingsPanel/>)
    }

    const logoutHandler = () => {
        AuthController.logout().then()
    }

    return (
        <div className='user-menu'>
            <div>
                <span>Change status</span>
            </div>
            <div onClick={settingsHandler}>
                <span>Settings</span>
            </div>
            <div onClick={logoutHandler}>
                <span>Logout</span>
            </div>
        </div>
    );
};