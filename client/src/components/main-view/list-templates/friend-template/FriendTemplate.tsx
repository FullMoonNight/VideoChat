import React, {useContext} from 'react';
import './FriendTemplate.css'
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {UserElementType} from "../../../../types/UserElementType";
import {AiOutlineCheck, AiOutlineClose, AiOutlineUserDelete, AiOutlineUserAdd, AiOutlineMessage} from "react-icons/ai";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import ChatsController from "../../../../controllers/ChatsController";
import {ViewPanelsContext} from "../../MainView";
import {DirectMessagesMainPanel} from "../../main-panels/dirrect-messages-main-panel/DirectMessagesMainPanel";

interface Props {
    data: {
        id: string,
        user: UserElementType
    },
    props: {
        buttonConfig: {
            message?: boolean,
            addFriend?: boolean,
            acceptFriend?: boolean,
            rejectFriend?: boolean,
            removeFriend?: boolean
        }
    }
}

export const FriendTemplate = ({data, props}: Props) => {
    const {chats, user} = useContext(MainContext)
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const clickHandler = () => {
    }

    const messageBtnHandler = async () => {
        let certainChat = chats.chats.find(chat => chat.type === 'common' && chat.chatMembers.length === 2 && chat.chatMembers.find(member => member.userId === data.user.userId))
        if (!certainChat && user.user.userId) {
            certainChat = await ChatsController.createChat({initiatorUserId: user.user.userId, interlocutorId: data.user.userId})
        }
        if (!certainChat) return
        setPanelsHandler({
            mainComponent: <DirectMessagesMainPanel chat={certainChat}/>
        })
    }

    const addFriendBtnHandler = async () => {
        await UserFriendsController.sendFriendRequest({userId: data.user.userId})
    }

    const acceptFriendBtnHandler = async () => {
        await UserFriendsController.acceptFriendRequest({userId: data.user.userId})
    }

    const rejectFriendBtnHandler = async () => {
        await UserFriendsController.rejectFriendRequest({userId: data.user.userId})
    }

    const removeFriendBtnHandler = async () => {
        await UserFriendsController.removeFriendRequest({userId: data.user.userId})
    }

    return (
        <div className='friend-element' onClick={clickHandler}>
            <div className='user-avatar'>
                <img src={`user-avatar/${data.user.userId}--${data.user.userImageId}.png`} alt=""/>
                <span className={`user-status ${data.user.status || 'active'}`}></span>
            </div>
            <span className='user-username'>{data.user.username}</span>
            <div className="spacer"></div>
            <button className='message' hidden={!props.buttonConfig?.message} onClick={messageBtnHandler}><AiOutlineMessage/></button>
            <button className='addFriend' hidden={!props.buttonConfig?.addFriend} onClick={addFriendBtnHandler}><AiOutlineUserAdd/></button>
            <button className='acceptFriend' hidden={!props.buttonConfig?.acceptFriend} onClick={acceptFriendBtnHandler}><AiOutlineCheck/></button>
            <button className='rejectFriend' hidden={!props.buttonConfig?.rejectFriend} onClick={rejectFriendBtnHandler}><AiOutlineClose/></button>
            <button className='removeFriend' hidden={!props.buttonConfig?.removeFriend} onClick={removeFriendBtnHandler}><AiOutlineUserDelete/></button>
        </div>
    )
}