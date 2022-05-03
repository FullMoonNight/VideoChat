import React, {useContext, useMemo} from 'react';
import {ChatElementType} from "../../../../types/ChatElementType";
import './ChatTemplate.css'
import {MainContext} from "../../../../index";
import {ViewPanelsContext} from "../../MainView";
import {DirectMessagesMainPanel} from "../../main-panels/dirrect-messages-main-panel/DirectMessagesMainPanel";

interface Props {
    data: {
        id: string,
    } & ChatElementType,
    props: {}
}

export const ChatTemplate = ({data}: Props) => {
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const {user} = useContext(MainContext)
    console.log(data)
    const clickHandler = () => {
        setPanelsHandler({
            mainComponent: <DirectMessagesMainPanel chat={data}/>
        })
    }
    const interlocutor = useMemo(() => data.chatMembers.find(member => member.userId !== user.user.userId), [])
    return (
        <div className='chat-element' onClick={clickHandler}>
            <div className="chat-element__image">
                <img src={`user-avatar/${interlocutor?.userId}--${interlocutor?.userImageId}.png`} alt="chat-img"/>
            </div>
            <span className='chat-element__chat-name'>Chat: {interlocutor?.username}</span>
        </div>
    );
};