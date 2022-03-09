import React, {useContext, useState} from 'react';
import './UserPanel.css'
import {UserMenu} from "./user-menu/UserMenu";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";

export const UserPanel = observer(() => {
    const {user} = useContext(MainContext)

    const [active, setActive] = useState<boolean>(false)

    const clickHandler = () => {
        setActive(current => !current)
    }

    return (
        <div className="user-profile-panel">
            <div className='img-nickname-card' onClick={clickHandler}>
                <img src={`user-avatar/${user.user.userImageId}.png`} alt="user"/>
                <div className="status-username">
                    <span className='status-emblem active'></span>
                    <p className='user-username'>Rakuk</p>
                </div>
            </div>
            {active ? <UserMenu setActive={setActive}/> : null}
        </div>

    )
        ;
});