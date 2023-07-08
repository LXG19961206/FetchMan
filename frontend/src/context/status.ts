import {createContext} from "react";

export const StatusContext = createContext<{
    showRespShowState: boolean,
    loading: boolean,
    port: number,
    setPort: (port: number) => void,
    setRespShowState: (boo: boolean) => void,
    setLoading: (boo: boolean) => void,
    size: { width: number, height: number },
    getTabId: () => number,
    setSize: (payload: { width: number, height: number }) => void
}>({
    port: 0,
    setPort (port: number) {},
    showRespShowState: false,
    getTabId () { return 0 },
    loading: false,
    setRespShowState (boo: boolean) {},
    setLoading (boo: boolean)  {},
    size: { width: 0, height: 0 },
    setSize (payload: { width: number, height: number }) {}
})