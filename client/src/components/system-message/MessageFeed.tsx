import React, {useContext} from 'react';
import './MessageFeed.css'
import {MainContext} from "../../index";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import {useTransition, animated} from "@react-spring/web";

export const MessageFeed = observer(() => {
    const {messages} = useContext(MainContext)
    const transitions = useTransition(messages.messages, {
        from: {opacity: 1},
        leave: {opacity: 0},
        delay: 2000,
    })

    return <div className='message-box'>
        {
            transitions(({opacity}, item) => (
                    <animated.div key={item.id} className={`message ${item.type}`} style={{opacity}}>
                        {item.message}
                    </animated.div>
                )
            )
        }
    </div>
});