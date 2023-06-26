import React, {Fragment, useState} from 'react';
import { Tabs, TabPane, List } from '@douyinfe/semi-ui';
import { IconSendStroked, IconPlusCircle } from '@douyinfe/semi-icons';
import Instance from "../instance";
import {Colors, createStyle, OverFlow, Position, px, vh} from "../../style";
import {border} from "../../style/common";


export default () => {

    const [tabList, setList] = useState([
        { tab: <span><IconSendStroked/> new request </span>, itemKey: '1', closable: true },
        { tab: '快速起步', itemKey: '2', closable: true },
        { tab: <span><IconPlusCircle/> new request </span>, itemKey: '3'},
    ])

    const close = (key: string) => {
        const newTabList = [...tabList];
        setList(
            tabList.filter(item => item.itemKey !== key)
        )
    }
    return (
        <div style={style.wrapper}>
            <Tabs
                size="large"
                type="card"
                defaultActiveKey="1"
                onTabClose={close}>
                {
                    tabList.map(t =>
                        <TabPane
                            style={{ height: "100vh" }}
                            closable={t.closable}
                            tab={t.tab}
                            itemKey={t.itemKey}
                            key={t.itemKey}>
                            <Instance></Instance>
                        </TabPane>
                    )
                }
            </Tabs>
        </div>
    );
}

const style = {
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

