import React from 'react';
import './AsidePanel.css'
import {UserPanel} from "./user-panel/UserPanel";

export const AsidePanel = () => {
    return (
        <aside className='main-view-aside'>
            <header className='aside-header'>
                <UserPanel/>
                <span className='main-logo'>LOGO</span>
            </header>
        </aside>
    );
};