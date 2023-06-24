import {createContext} from "react";

export const StatusContext = createContext<{
    showRespShowState: boolean,
    loading: boolean,
    setRespShowState: (boo: boolean) => void,
    setLoading: (boo: boolean) => void,
    size: { width: number, height: number },
    setSize: (payload: { width: number, height: number }) => void
}>({
    showRespShowState: false,
    loading: false,
    setRespShowState (boo: boolean) {},
    setLoading (boo: boolean)  {},
    size: { width: 0, height: 0 },
    setSize (payload: { width: number, height: number }) {}
})