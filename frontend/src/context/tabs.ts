import { createContext } from "react";

export type TabPage = {
    id: number,
    url: string,
    method: string,
    reqId: number
}

export type TabPages = TabPage []

export const TabsContext = createContext<{
    value: TabPages,
    close: (id: number) => void, 
    open: () => void,
    isLastItem: (id: number) => boolean,
    setItem: (id: number, tab: Partial<TabPage>) => void
}>({
    value: [] as TabPages,
    close (id: number) {},
    open () {},
    isLastItem (id: number) { return false },
    setItem (id: number, tab: Partial<TabPage>) {}
})


