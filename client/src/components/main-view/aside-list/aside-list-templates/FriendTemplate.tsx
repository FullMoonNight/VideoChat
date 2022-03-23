import './FriendTemplate.css'

interface Props {
    data: {
        id: string,
        user: {
            userId: string,
            userImageId: string,
            username: string,
            status?: 'active' | 'sleep' | 'invisible'
        }
    }
}

export const FriendTemplate = ({data}: Props) => {
    return (
        <div className='friend-element'>
            <div className='user-avatar'>
                <img src={`user-avatar/${data.user.userId}--${data.user.userImageId}.png`} alt=""/>
                <span className={`user-status ${data.user.status || 'active'}`}></span>
            </div>
            <span className='user-username'>{data.user.username}</span>
        </div>
    )
}