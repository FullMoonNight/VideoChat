import React, {useContext} from 'react';
import './AsidePanel.css'
import {UserBlock} from "./user-panel/UserBlock";
import {AsideMenu} from "./aside-menu/AsideMenu";
import {ViewPanelsContext} from "../MainView";


export const AsidePanel = () => {
    const {components} = useContext(ViewPanelsContext)

    return (
        <aside className='main-view-aside'>
            <header className='aside-header'>
                <UserBlock/>
                <span className='main-logo'>LOGO</span>
            </header>
            <main className='aside-main'>
                <AsideMenu/>
                <div className="aside-list-container">
                    {components.asidePanel}
                </div>
            </main>
        </aside>
    );
};