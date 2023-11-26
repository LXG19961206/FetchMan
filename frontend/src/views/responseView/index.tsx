import {SideSheet, TabPane, Tabs, Divider, Spin, Tag } from '@douyinfe/semi-ui';
import {useContext, useState} from 'react';
import {ReqContext, RespContext, StatusContext} from '../../context'
import ReactJson from 'react-json-view';
import {Preview} from "./preview";
import {createStyle, vh, Display, OverFlow, percent, Position, px, Resize, BoxSizing} from "../../style";
import {border, FlexCenter, getWindowHeight, marginX, paddingX, Reset} from "../../style/common";
import ResizeableWrapper from "../../components/resizeableWrapper/resizeableWrapper";
import {Match} from "../../components/headerless/match";
import {Size} from "../../dicts";
import {RenderIf} from "../../components/headerless/renderIf";
import Headers from './headers'
import Header from "@douyinfe/semi-ui/lib/es/image/previewHeader";
// const RespTabsDict = {
//     body: ["body"],
//     headers: ["headers"]
// }

export default () => {
    const reqContext = useContext(ReqContext)
    const [currentIdx, setIdx] = useState("1")
    const respCtx = useContext(RespContext)
    const statusCtx = useContext(StatusContext)

    return (
        <ResizeableWrapper
            min={{ height: 200, width: 0 }}
            // max={{ height: statusCtx.size.height * 0.8, width: statusCtx.size.width }}
            top={ true }
            style={style.wrapper}>
            <RenderIf when={statusCtx.loading}>
                <div style={style.loading}>
                    <Spin tip="loading..." size={Size.large}></Spin>
                </div>
            </RenderIf>
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
                    <div style={style.plainText}> { respCtx.respBody }  </div>
                </Match.Option>
            </Match>
        </ResizeableWrapper>
    )
}

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