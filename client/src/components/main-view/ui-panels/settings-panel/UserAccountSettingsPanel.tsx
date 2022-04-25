import React, {ChangeEvent, useContext} from 'react';
import './UserAccountSettingsPanel.css'
import {useImmer} from "use-immer";
import ProfileSettingsController from "../../../../controllers/ProfileSettingsController";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {WinContext} from "../../../../pages/MainViewPage";

interface SettingsPanelFieldType {
    avatar: Blob,
    username: string,
    name?: string,
    surname?: string,
    colorTheme: 'light' | 'dark'
}

export const UserAccountSettingsPanel = observer(() => {
    const {profile, user} = useContext(MainContext)
    const {closeHandler} = useContext(WinContext)

    const [panelState, setPanelState] = useImmer<SettingsPanelFieldType>({
        avatar: new Blob(),
        username: profile.settings.username,
        name: profile.settings.name || '',
        surname: profile.settings.surname || '',
        colorTheme: ProfileSettingsController.getCurrentColorScheme()
    })

    const imageChangeHandler = (e: any) => {
        const event = e as ChangeEvent<HTMLInputElement>
        if (!event.target.files) return

        const file = event.target.files[0]
        setPanelState(draft => {
            draft.avatar = file
        })
    }

    const changeThemeHandler = (e: any) => {
        const event = e as ChangeEvent<HTMLInputElement>
        const theme = event.target.checked ? 'light' : 'dark'

        ProfileSettingsController.changeColorScheme(theme)
        setPanelState(draft => {
            draft.colorTheme = theme
        })
    }

    const changeHandler = (e: any) => {
        const event = e as ChangeEvent<HTMLInputElement>
        const field = event.target.name as 'username' | 'name' | 'surname'
        const value = event.target.value

        setPanelState(draft => {
            draft[field] = value
        })
    }

    const submitHandler = async () => {
        await ProfileSettingsController.saveProfileSettings({
            username: panelState.username,
            name: panelState.name,
            surname: panelState.surname
        }, panelState.avatar)
        closeHandler()
    }

    return (
        <div className='settings-panel'>
            <div className="panel-header">
                <span>Settings</span>
                <button type='submit' onClick={submitHandler}>Save</button>
            </div>
            <div className="separator-line"></div>
            <div className="content">
                <div className="profile-block">
                    <p className='section-title'>Profile</p>
                    <div className="profile-grid">
                        <div className="avatar-block">
                            <label htmlFor="select-avatar-button">Select new image</label>
                            <input
                                type='file'
                                accept={['image/png', 'image/jpeg'].join(',')}
                                id='select-avatar-button'
                                hidden
                                alt='user'
                                onChange={imageChangeHandler}
                            />
                            <img
                                src={panelState.avatar.size ? URL.createObjectURL(panelState.avatar) : `user-avatar/${user.user.userId}--${profile.settings.userImageId}.png`}
                                alt=""

                            />
                        </div>
                        <div className="user-info-block">
                            <div className="input-block">
                                <input
                                    type="text"
                                    id='username'
                                    name='username'
                                    required
                                    onChange={changeHandler}
                                    value={panelState.username}
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="input-block">
                                <input
                                    type="text"
                                    id='name'
                                    name='name'
                                    required
                                    onChange={changeHandler}
                                    value={panelState.name}
                                />
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="input-block">
                                <input
                                    type="text"
                                    id='surname'
                                    name='surname'
                                    required
                                    onChange={changeHandler}
                                    value={panelState.surname}
                                />
                                <label htmlFor="surname">Surname</label>
                            </div>
                        </div>
                        <div className="application-block">
                            <span>Change theme</span>
                            <input type="checkbox" hidden id='theme-toggle' checked={panelState.colorTheme === "light"} onChange={changeThemeHandler}/>
                            <label htmlFor="theme-toggle" className='theme-toggle'></label>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
});