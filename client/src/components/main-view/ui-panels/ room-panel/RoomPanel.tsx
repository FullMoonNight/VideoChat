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

    const {clients, provideMediaRef} = useWebRTC(roomId)
    return (
        <div className="no-close-wrapper" onClick={() => closeHandler()}>
            <div className='room-panel'>
                <div className="room-panel__content">
                    {clients.map(clientObj => {
                        let member: { userId: string, userImageId: string }
                        if (clientObj.socketId === 'local') {
                            member = {userId: user.user.userId || '', userImageId: profile.settings.userImageId}
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
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
});