import React, {createContext, useContext, useEffect} from 'react';
import {AsidePanel} from "./main-view-aside/AsidePanel";
import {MainContext} from "../../index";
import ProfileSettingsController from "../../controllers/ProfileSettingsController";
import {observer} from "mobx-react-lite";
import {useImmer} from "use-immer";
import './MainView.css'

interface ViewPanelsType {
    asidePanel: JSX.Element | null,
    mainPanel: JSX.Element | null
}

interface ContextType {
    components: ViewPanelsType,
    setPanelsHandler: ({asideComponent, mainComponent}: { asideComponent?: JSX.Element | null, mainComponent?: JSX.Element | null }) => void
}

export const ViewPanelsContext = createContext<ContextType>({} as ContextType)

export const MainView = observer(() => {
    const {app, profile} = useContext(MainContext)

    const [viewPanels, setViewPanels] = useImmer<ViewPanelsType>({asidePanel: null, mainPanel: null})

    const setPanels = ({asideComponent, mainComponent}: { asideComponent?: JSX.Element | null, mainComponent?: JSX.Element | null }) => {
        // if undefined - not change current viewed panel
        const aside = asideComponent === undefined ? viewPanels.asidePanel : asideComponent
        const main = mainComponent === undefined ? viewPanels.mainPanel : mainComponent

        setViewPanels(draft => {
            draft.asidePanel = aside
            draft.mainPanel = main
            return draft
        })
    }

    useEffect(() => {
        if (!profile.loaded) {
            app.appStartLoading()
            ProfileSettingsController.getProfileSettings().then(res => app.appEndLoading())
        }
    }, [])

    return (
        <ViewPanelsContext.Provider value={{
            components: {
                mainPanel: viewPanels.mainPanel,
                asidePanel: viewPanels.asidePanel
            },
            setPanelsHandler: setPanels
        }}>
            <div className="main-viewport">
                <AsidePanel/>
                <div className="main-view-container">
                    {viewPanels.mainPanel}
                </div>
            </div>
        </ViewPanelsContext.Provider>
    );
});