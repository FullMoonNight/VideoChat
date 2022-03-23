import React, {useContext} from 'react';
import './AsidePanel.css'
import {UserPanel} from "./user-panel/UserPanel";
import {AsideMenu} from "./aside-menu/AsideMenu";
import {ViewPanelsContext} from "../MainView";


export const AsidePanel = () => {
    const {components} = useContext(ViewPanelsContext)

    return (
        <aside className='main-view-aside'>
            <header className='aside-header'>
                <UserPanel/>
                <span className='main-logo'>LOGO</span>
            </header>
            <main className='aside-main'>
                <AsideMenu/>
                {components.asideComponent}
            </main>
        </aside>
    );
};