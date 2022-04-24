import React, {useContext, useMemo} from 'react';
import './RoomPanel.css'
import {useWebRTC} from "../../../../hooks/useWebRTC";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {UserElementType} from "../../../../types/UserElementType";

interface Params {
    roomId: string
}

export const RoomPanel = observer(({roomId}: Params) => {
    const {rooms} = useContext(MainContext)
    const currentRoom = useMemo(() => rooms.rooms.find(room => room.roomId === roomId), [rooms.rooms, roomId])
    const roomMembers = useMemo(() => {
        const membersMap: { [key: string]: UserElementType } = {}
        currentRoom?.roomMembers.forEach(member => {
            membersMap[member.userId] = member
        })
        return membersMap
    }, [currentRoom])

    const {clients, provideMediaRef} = useWebRTC(roomId)
    console.log(clients)
    return (
        <div className="no-close-wrapper">
            <div className='room-panel'>
                {clients.map(clientObj => {
                    const imageVisible = ''
                    return (
                        <div key={clientObj.socketId}>
                            <video
                                ref={instance => {
                                    provideMediaRef(clientObj.socketId, instance)
                                }}
                                src=""
                                autoPlay
                                playsInline
                                controls={false}
                                muted={clientObj.socketId === 'local'}/>
                        </div>
                    )
                })}
            </div>
        </div>
    );
});