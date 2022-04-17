interface Props {
    data: {
        id: string,
        name: string,
        room_id: string,
        owner: string,
        roomImageId: string
    },
    props: {}
}

export const ConferenceRoomTemplate = ({data}: Props) => {
    console.log(data)
    return (
        <div className='room-element'>
            <div className='room-image'>
                <img src={`room-image/${data.roomImageId}.png`} alt=""/>
            </div>
            <span className='room-name'>{data.name}</span>

        </div>
    )
}