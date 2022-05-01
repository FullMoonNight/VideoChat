import React from 'react';
import {ChatElementType} from "../../../../types/ChatElementType";

interface Props {
    data: {
        id: string,
    } & ChatElementType,
    props: {}
}

export const ChatTemplate = ({data}: Props) => {
    console.log(data)
    return (
        <div>
            <div className="room-element__image">
                <img src={`user-avatar/${data.chatMembers[0]?.userId}--${data.chatMembers[0]?.userImageId}.png`} alt="chat-img"/>
            </div>
            <span className='room-element__room-name'>Chat: {data.chatMembers[0]?.username}</span>
        </div>
    );
};