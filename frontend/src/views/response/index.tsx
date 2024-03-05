import { SideSheet, TabPane, Tabs, Divider, Spin, Tag } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { Preview } from "./preview";
import { createStyle, vh, percent, Position, px, BoxSizing } from "@/style";
import { border, FlexCenter, Reset } from "@/style/common";
import ResizeableWrapper from "@/components/resizeableWrapper/resizeableWrapper";
import { Match } from "@/components/headerless/match";
import Headers from './headers'
import { useRespStore } from '@/store/resp';
import { observer } from 'mobx-react'


export default observer(() => {

    const [currentIdx, setIdx] = useState("1")
    const respStore = useRespStore()

    return (
        <ResizeableWrapper
            min={{ height: 200, width: 0 }}
            // max={{ height: statusCtx.size.height * 0.8, width: statusCtx.size.width }}
            top={true}
            style={style.wrapper}>
            <Tabs type="button"
                onChange={setIdx}
                activeKey={currentIdx}>
                <TabPane tab="Header" itemKey="1"></TabPane>
                <TabPane tab="Preview" itemKey="2"></TabPane>
                <TabPane tab="Response" itemKey="3"></TabPane>
            </Tabs>
            <Match>
                <Match.Option when={currentIdx === "1"}>
                    <Headers></Headers>
                </Match.Option>
                <Match.Option when={currentIdx === "2"}>
                    <Preview></Preview>
                </Match.Option>
                <Match.Option when={currentIdx === "3"}>
                    <div style={style.plainText}> {respStore.currentViewResp?.data}  </div>
                </Match.Option>
            </Match>
        </ResizeableWrapper>
    )
})

const style = {
    plainText: createStyle({
        boxSizing: BoxSizing.borderBox,
        padding: px(16),
        width: percent(90),
        fontSize: px(13)
    }),
    wrapper: createStyle({
        ...Reset,
        position: Position.absolute,
        width: percent(100),
        height: vh(50),
        left: 0,
        right: 0,
        borderTop: border('1px', '#eeeeee'),
        cursor: "se-resize",
        bottom: 0,
        background: "#fff",
        zIndex: 999,
    }),
    loading: createStyle({
        position: Position.relative,
        zIndex: 100,
        width: percent(100),
        height: percent(100),
        maxHeight: vh(99),
        ...FlexCenter
    })
}