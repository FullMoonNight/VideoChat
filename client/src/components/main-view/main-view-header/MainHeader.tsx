import React from 'react';
import './MainHeader.css'

export const MainHeader = () => {
    return (
        <header className='main-view-header'>
            <div className="user-profile-menu">
                <img src="123" alt=""/>
                <div className="status-username">
                    <span className='status-emblem'>&nbsp;</span>
                    <p className='user-username'>Rakuk</p>
                </div>
            </div>
        </header>
    );
};