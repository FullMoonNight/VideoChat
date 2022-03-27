import {useState} from "react";

export const FriendMainPanel = () => {
    const [findUsername, setFindUsername] = useState<string>('')

    return (

        <div className="friend-list-panel">
            <div className="friend-type-menu">
                <ul>
                    <li>123</li>
                    <li>345</li>
                    <li>456</li>
                    <li>567</li>
                </ul>
            </div>
        </div>
    )
}