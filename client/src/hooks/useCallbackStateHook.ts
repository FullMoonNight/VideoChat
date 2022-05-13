import {useEffect, useRef, useState} from "react";

type ReturnVal<T> = [T, (state: T | ((prevState: T) => T), cb?: (updatedState: T) => void) => void]

export function useCallbackState<T = any>(initialState: T): ReturnVal<T> {
    const [state, setState] = useState<T>(initialState)
    const cb = useRef<(updatedState: T) => void>()

    const updateState = (newState: T | ((prevState: T) => T), callBack?: (updatedState: T) => void) => {
        cb.current = callBack
        // @ts-ignores
        setState(prevState => typeof newState === 'function' ? newState(prevState) : newState)
    }

    useEffect(() => {
        if (cb.current) {
            cb.current(state)
            cb.current = undefined
        }
    }, [state])

    return [state, updateState]
}