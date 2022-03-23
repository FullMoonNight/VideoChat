import React, {createContext, useContext, useEffect} from 'react';
import {AsidePanel} from "./main-view-aside/AsidePanel";
import {MainContext} from "../../index";
import ProfileSettingsController from "../../controllers/ProfileSettingsController";
import {observer} from "mobx-react-lite";
import {useImmer} from "use-immer";

interface ViewPanelsType {
    asideComponent: JSX.Element | null,
    mainComponent: JSX.Element | null
}

interface ContextType {
    components: ViewPanelsType,
    changeHandler: ({asideComponent, mainComponent}: { asideComponent?: JSX.Element, mainComponent?: JSX.Element }) => void
}

export const ViewPanelsContext = createContext<ContextType>({} as ContextType)

export const MainView = observer(() => {
    const {app, profile} = useContext(MainContext)

    const [viewPanels, setViewPanels] = useImmer<ViewPanelsType>({asideComponent: null, mainComponent: null})

    const changePanels = ({asideComponent, mainComponent}: { asideComponent?: JSX.Element, mainComponent?: JSX.Element }) => {
        const aside = asideComponent === undefined ? viewPanels.asideComponent : asideComponent
        const main = mainComponent === undefined ? viewPanels.mainComponent : mainComponent

        setViewPanels(draft => {
            draft.asideComponent = aside
            draft.mainComponent = main
            return draft
        })
    }

    useEffect(() => {
        app.appStartLoading()
        !profile.loaded && ProfileSettingsController.getProfileSettings().then(res => app.appEndLoading())
    }, [])

    return (
        <ViewPanelsContext.Provider value={{
            components: {
                mainComponent: viewPanels.mainComponent,
                asideComponent: viewPanels.asideComponent
            },
            changeHandler: changePanels
        }
        }>
            <AsidePanel/>
            {viewPanels.mainComponent}
        </ViewPanelsContext.Provider>
    );
});