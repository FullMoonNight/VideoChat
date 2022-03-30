import './FriendTemplate.css'
import UserFriendsController from "../../../../controllers/UserFriendsController";

interface Props {
    data: {
        id: string,
        user: {
            userId: string,
            userImageId: string,
            username: string,
            status?: 'active' | 'sleep' | 'invisible'
        }
    },
    buttonConfig?: {
        message?: boolean,
        addFriend?: boolean,
        acceptFriend?: boolean,
        rejectFriend?: boolean,
        removeFriend?: boolean
    }
}

export const FriendTemplate = ({data, buttonConfig}: Props) => {
    const clickHandler = () => {
    }

    const messageBtnHandler = () => {

    }

    const addFriendBtnHandler = () => {
        UserFriendsController.sendFriendRequest({userId: data.user.userId})
    }

    const acceptFriendBtnHandler = () => {
        UserFriendsController.acceptFriendRequest({userId: data.user.userId})
    }

    const rejectFriendBtnHandler = () => {
        UserFriendsController.rejectFriendRequest({userId: data.user.userId})
    }

    const removeFriendBtnHandler = () => {
    }

    return (
        <div className='friend-element' onClick={clickHandler}>
            <div className='user-avatar'>
                <img src={`user-avatar/${data.user.userId}--${data.user.userImageId}.png`} alt=""/>
                <span className={`user-status ${data.user.status || 'active'}`}></span>
            </div>
            <span className='user-username'>{data.user.username}</span>
            <div className="spacer"></div>
            <button className='message' hidden={!buttonConfig?.message} onClick={messageBtnHandler}>M</button>
            <button className='addFriend' hidden={!buttonConfig?.addFriend} onClick={addFriendBtnHandler}>A</button>
            <button className='acceptFriend' hidden={!buttonConfig?.acceptFriend} onClick={acceptFriendBtnHandler}>V</button>
            <button className='rejectFriend' hidden={!buttonConfig?.rejectFriend} onClick={rejectFriendBtnHandler}>R</button>
            <button className='removeFriend' hidden={!buttonConfig?.removeFriend} onClick={removeFriendBtnHandler}>X</button>
        </div>
    )
}