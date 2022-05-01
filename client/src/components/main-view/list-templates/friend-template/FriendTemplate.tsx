import React from 'react';
import './FriendTemplate.css'
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {UserElementType} from "../../../../types/UserElementType";
import {AiOutlineCheck, AiOutlineClose, AiOutlineUserDelete, AiOutlineUserAdd, AiOutlineMessage} from "react-icons/ai";

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
    const clickHandler = () => {
    }

    const messageBtnHandler = () => {
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