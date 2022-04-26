import React, {useContext, useMemo} from 'react';
import './RoomPanel.css'
import {useWebRTC} from "../../../../hooks/useWebRTC";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {UserElementType} from "../../../../types/UserElementType";
import {WinContext} from "../../../../pages/MainViewPage";

interface Params {
    roomId: string
}

export const RoomPanel = observer(({roomId}: Params) => {
    const {rooms, user, profile} = useContext(MainContext)
    const {closeHandler} = useContext(WinContext)
    const currentRoom = useMemo(() => rooms.rooms.find(room => room.roomId === roomId), [rooms.rooms, roomId])
    const roomMembers = useMemo(() => {
        const membersMap: { [key: string]: UserElementType } = {}
        currentRoom?.roomMembers.forEach(member => {
            membersMap[member.userId] = member
        })
        return membersMap
    }, [currentRoom])

    const {clients, provideMediaRef, controllers} = useWebRTC(roomId)
    return (
        <div className="no-close-wrapper">
            <div className='room-panel'>
                <div className="room-panel__content">
                    {clients.map(clientObj => {
                        let member: { userId: string, userImageId: string, username: string }
                        if (clientObj.socketId === 'local') {
                            member = {userId: user.user.userId || '', userImageId: profile.settings.userImageId, username: profile.settings.username}
                        } else {
                            member = roomMembers[clientObj.userId]
                        }
                        return (
                            <div key={clientObj.socketId} className='member-plate'>
                                <img src={`/user-avatar/${member.userId}--${member.userImageId}.png`} alt=""/>
                                <div className="video-block">
                                    <video
                                        ref={instance => {
                                            provideMediaRef(clientObj.socketId, instance)
                                        }}
                                        src=""
                                        autoPlay
                                        playsInline
                                        controls={false}
                                        muted={clientObj.socketId === 'local'}
                                    />
                                </div>
                                <p className="username">{member.username}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="room-panel__control-block">
                    <div className="button-block">
                        <button className='microphone' onClick={controllers.microphone.handler}>mic {controllers.microphone.mute ?  'off' : 'on'}</button>
                        <button className='mute' onClick={controllers.deafen.handler}>{controllers.deafen.state ? 'unmute' : 'mute'}</button>
                        <button className='video' onClick={controllers.video.handler}>vid {controllers.video.visible ?  'on' : 'off'}</button>
                        <button className='leave' onClick={() => closeHandler()}>leave</button>
                        <div className="spacer"></div>
                        {currentRoom && (currentRoom.editors.text || currentRoom.editors.handWr) ? <button className='editors'>editors</button> : null}
                        {currentRoom && currentRoom.chat ? <button className='chat'>chat</button> : null}

                    </div>
                </div>
            </div>
        </div>
    );
});