import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabPane, Tag } from '@douyinfe/semi-ui';
import { StartNewTab, CloseTab, LsAllTabs } from "../../../wailsjs/go/app/App";
import Instance from "../instance";
import { Colors, createStyle, OverFlow, Position, px, vh } from "../../style";
import { border } from "../../style/common";
import { TabsContext, TabPages, TabPage } from '../../context/tabs'
import { Methods } from '../../dicts';


type TabDbStruct = {
    create_time: string,
    id: number,
    req_id: number,
    url: string,
    method: string
}


export default () => {

    const [tabs, setTabs] = useState<TabPages>([])

    const open = () => {
        StartNewTab().then(id => {
            setTabs(oldValue => ([
                ...oldValue,
                { id: id, method: "get", url: "New Request", reqId: 0 }
            ]))
        })
    }

    const reflectTabs = (tabs: TabDbStruct[]) => {
        setTabs(tabs.map(tab => ({
            id: tab.id, method: tab.method || Methods.get, url: tab.url, reqId: tab.req_id
        })))
    }


    const close = (id: number) => {
        CloseTab(id)
        setTabs(oldValue => oldValue.filter(tab => tab.id !== id))
    }


    const tabStore = {
        value: tabs,
        open,
        close,
        isLastItem(id: number) {
            return tabs.slice(-1)[0].id === id
        },
        setItem(id: number, newIndo: Partial<TabPage>) {

            const prevTab = tabs.find(tab => tab.id === id)

            if (prevTab) {
                setTabs(tabs => tabs.map(tab => tab.id !== id ? tab : { ...prevTab, ...newIndo }))
            }

        }
    }

    const tabList = useMemo(() => (
        tabs.map(tab => ({
            tab: <span> <Tag color={"teal"}> {tab.method.toUpperCase()} </Tag> {tab.url} </span>,
            itemKey: tab.id,
            closable: true,
            req_id: tab.reqId
        }))
    ), [tabs])

    useEffect(() => {

        LsAllTabs().then(resp => {
            let res = resp as TabDbStruct[]
            if (!res || !res.length) {
                open()
            } else {
                reflectTabs(res)
            }
        })

    }, [])


    return (
        <TabsContext.Provider value={tabStore}>
            <div style={style.wrapper}>
                <Tabs
                    size="large"
                    type="card"
                    lazyRender
                    defaultActiveKey="1"
                    onTabClose={key => close(+key)}>
                    {
                        tabList.map(t =>
                            <TabPane
                                style={{ height: "100vh" }}
                                closable={tabs.length > 1}
                                tab={t.tab}
                                itemKey={t.itemKey.toString()}
                                key={t.itemKey}>
                                <Instance
                                    reqId={t.req_id} 
                                    id={t.itemKey}></Instance>
                            </TabPane>
                        )
                    }
                </Tabs>
            </div>
        </TabsContext.Provider>

    );
}

const style = {
    addIcon: createStyle({}),
    wrapper: createStyle({
        top: px(0),
        bottom: px(0),
        height: vh(100),
        right: 0,
        overflow: OverFlow.hidden,
        width: `calc(100% - 305px)`,
        minWidth: px(500),
        position: Position.fixed,
        left: px(305),
        background: Colors.White,
        borderLeft: border("1px", '#eee')
    })
}

