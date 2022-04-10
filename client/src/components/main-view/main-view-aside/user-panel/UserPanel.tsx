import React, {useContext, useState} from 'react';
import './UserPanel.css'
import {UserMenu} from "./user-menu/UserMenu";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";

export const UserPanel = observer(() => {
    const {profile, user} = useContext(MainContext)

    const [active, setActive] = useState<boolean>(false)

    const clickHandler = () => {
        setActive(current => !current)
    }

    return (
        <div className="user-profile-panel">
            <div className='img-nickname-card' onClick={clickHandler}>
                <img src={`user-avatar/${user.user.userId}--${profile.userImageId}.png`}
                     alt="user"
                     style={{
                         objectFit: 'cover'
                     }}/>
                <div className='status-username'>
                    <span className={`status-emblem ${profile.status}`}></span>
                    <p className='user-username'>{profile.username}</p>
                </div>
            </div>
            {active ? <UserMenu setActive={setActive}/> : null}
        </div>

    )
        ;
});