import './AsideMenu.css'
import {useContext, useEffect, useRef, useState} from "react";
import {ViewPanelsContext} from "../../MainView";
import {FriendTemplate} from "../../aside-list/aside-list-templates/FriendTemplate";
import {AsideList} from "../../aside-list/AsideList";
import {MainContext} from "../../../../index";
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {observer} from "mobx-react-lite";
import {FriendMainPanel} from "../../main-panels/FriendMainPanel";

const formatData = (dataList: any[], idValue: string) => {
    if (idValue === 'id') return dataList
    return dataList.map(e => ({...e, id: e[idValue]}))
}

interface ViewConfigurationType {
    asideComponent?: JSX.Element | null,
    mainComponent?: JSX.Element | null,
}

export const AsideMenu = observer(() => {
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const {friends} = useContext(MainContext)

    // Загрузка данных для всех элементов меню
    useEffect(() => {
        Promise.all([UserFriendsController.getAllFriends()])
            .then(() => {
                const savedActiveType = localStorage.getItem('activeMenuItem')
                if (savedActiveType) {
                    setActiveElement(savedActiveType, null)
                }
            })
    }, [])

    const [viewConfiguration, setViewConfiguration] = useState<ViewConfigurationType>({})
    useEffect(() => {
        setPanelsHandler({
            asideComponent: viewConfiguration.asideComponent,
            mainComponent: viewConfiguration.mainComponent
        })
    }, [viewConfiguration])

    useEffect(() => {
        setMenuState()
    }, [friends.friends])

    const menuBlock = useRef<HTMLDivElement>(null)
    const currentActiveElement = useRef<HTMLDListElement | null>(null)

    const setActiveElement = (type: string, element: HTMLDListElement | null) => {
        if (!element && menuBlock.current) {
            element = menuBlock.current.querySelector(`[data-name=${type}]`)
        }
        if (currentActiveElement.current) {
            currentActiveElement.current.classList.remove('active')
        }
        element && element.classList.add('active')
        currentActiveElement.current = element
        localStorage.setItem('activeMenuItem', type)

        setMenuState()
    }

    const setMenuState = () => {
        const type = currentActiveElement.current?.dataset.name
        if (!type) return

        switch (type) {
            case 'friends':
                setViewConfiguration({
                    asideComponent: <AsideList
                        Template={FriendTemplate}
                        dataList={formatData(friends.friends, 'linkId')}
                        props={{buttonConfig: {message: true}}}
                    />,
                    mainComponent: <FriendMainPanel/>,
                })
                break;
            case 'directChats':
                setViewConfiguration({
                    mainComponent: null,
                })
                break;
            case 'groupChats':
                setViewConfiguration({
                    mainComponent: null,
                })
                break;
            case 'videoConf':
                setViewConfiguration({
                    mainComponent: null,
                })
                break;
        }
    }

    const clickHandler = (e: any) => {
        const element = e.target
        const elementType = element.dataset.name
        if (!elementType) return

        setActiveElement(elementType, element)
    }

    return (
        <div className='menu-block' ref={menuBlock}>
            <ul className="menu-item-list" onClick={clickHandler}>
                <li className="menu-item" data-name='friends'>F</li>
                <li className="menu-item" data-name='directChats'>D</li>
                <li className="menu-item" data-name='groupChats'>G</li>
                <li className="menu-item" data-name='videoConf'>V</li>
            </ul>
        </div>
    )
})