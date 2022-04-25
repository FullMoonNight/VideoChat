import React, {useContext, useEffect, useState} from 'react';
import './UserBlock.css'
import {UserMenu} from "../user-menu/UserMenu";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../../index";

export const UserBlock = observer(() => {
    const {profile, user} = useContext(MainContext)

    const [active, setActive] = useState<boolean>(false)

    const clickHandler = () => {
        setActive(current => !current)
    }

    return (
        <div className="user-profile-block">
            <div className='img-nickname-card' onClick={clickHandler}>
                <img src={`user-avatar/${user.user.userId}--${profile.settings.userImageId}.png`}
                     alt="user"
                />
                <div className='status-username'>
                    <span className={`status-emblem ${profile.settings.status}`}></span>
                    <p className='user-username'>{profile.settings.username}</p>
                </div>
            </div>
            {active ? <UserMenu setActive={setActive}/> : null}
        </div>

    )
        ;
});