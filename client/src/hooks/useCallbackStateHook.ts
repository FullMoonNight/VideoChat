import {useEffect, useRef, useState} from "react";

export function useCallbackState<T = any>(initialState: T | (() => T)): [T, (state: T | ((val: T) => T), callback: () => void) => void] {
    const [state, setState] = useState<T>(initialState)
    const cb = useRef<() => void>()

    const updateState = (newState: T | ((val: T) => T), callback: () => void) => {
        cb.current = callback
        // @ts-ignore
        setState(prevState => typeof newState === 'function' ? newState(prevState) : newState)
    }

    useEffect(() => {
        if (cb.current) {
            cb.current()
            cb.current = undefined
        }
    }, [state])

    return [state, updateState]
}