import React from 'react';
import './RoomPanel.css'
import {useWebRTC} from "../../../../hooks/useWebRTC";

interface Params {
    roomId: string
}

export const RoomPanel = ({roomId}: Params) => {
    const {clients, provideMediaRef} = useWebRTC(roomId)

    return (
        <div className="no-close-wrapper">
            <div className='room-panel'>
                {clients.map(clientId => (
                    <div key={clientId}>
                        <video
                            ref={instance => {
                                provideMediaRef(clientId, instance)
                            }}
                            src=""
                            autoPlay
                            playsInline
                            controls={false}
                            muted={clientId === 'local'}/>
                    </div>
                ))}
            </div>
        </div>
    );
};