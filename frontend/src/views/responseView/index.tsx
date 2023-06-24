import {SideSheet, TabPane, Tabs, Divider, Spin} from '@douyinfe/semi-ui';
import {useContext, useState} from 'react';
import {ReqContext, RespContext, StatusContext} from '../../context'
import ReactJson from 'react-json-view';
import {Preview} from "./preview";
import {createStyle, vh,Display, OverFlow, percent, Position, px, Resize} from "../../style";
import {border, FlexCenter, getWindowHeight, marginX, paddingX, Reset} from "../../style/common";
import ResizeableWrapper from "../../components/resizeableWrapper";
import {Match} from "../../components/match";
import {Size} from "../../dicts";
import {RenderIf} from "../../components/renderIf";

// const RespTabsDict = {
//     body: ["body"],
//     headers: ["headers"]
// }

export default () => {
    const reqContext = useContext(ReqContext)
    const [currentIdx, setIdx] = useState("0")
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
                <TabPane tab="Payload" itemKey="0"></TabPane>
                <TabPane tab="Preview" itemKey="1"></TabPane>
                <TabPane tab="Response" itemKey="2"></TabPane>
            </Tabs>
            <Match>
                <Match.Option when={currentIdx === "0"}>
                    <ReactJson name={null} src={reqContext.params}></ReactJson>
                </Match.Option>
                <Match.Option when={currentIdx === "1"}>
                        <Preview></Preview>
                </Match.Option>
                <Match.Option when={currentIdx === "2"}>
                    <div> { respCtx.respBody }  </div>
                </Match.Option>
            </Match>
        </ResizeableWrapper>
    )
}

const style = {
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