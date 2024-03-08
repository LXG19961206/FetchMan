import { TabPane, Tabs, Divider, Spin, Tag } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { Preview } from "./preview";
import { Match } from "@/components/headerless/match";
import Headers from './headers'
import { useRespStore } from '@/store/resp';
import { observer } from 'mobx-react'
import style from './index.module.less'
import { IconClose } from '@douyinfe/semi-icons'
import { RenderIf } from '@/components/headerless/renderIf';
import { divide } from 'lodash';

export default observer((
    props?: {
        onClose: () => void
    }
) => {

    enum TabItem {
        Header = "Header",
        Preview = "Preview",
        Response = "Response"
    }

    const [currentIdx, setIdx] = useState(TabItem.Header as string)
    const respStore = useRespStore()

    return (
        <div
            className={style.resp_wrapper}>
            <RenderIf
                fallback={
                    <div className={style.loading}>
                        <Spin tip="loading" size='large'></Spin>
                    </div>
                }
                when={!respStore.isPending}>
                <IconClose onClick={props?.onClose} className={style.close_icon}>
                </IconClose>
                <Tabs type="button"
                    lazyRender
                    tabPosition="top"
                    className={style.tab_bar}
                    onChange={setIdx}
                    activeKey={currentIdx}>
                    <TabPane tab="Header" itemKey={TabItem.Header}>
                    </TabPane>
                    <TabPane tab="Preview" itemKey={TabItem.Preview}>
                    </TabPane>
                    <TabPane tab="Response" itemKey={TabItem.Response}>
                    </TabPane>
                </Tabs>
                <Match>
                    <Match.Option when={currentIdx === TabItem.Header}>
                        <Headers></Headers>
                    </Match.Option>
                    <Match.Option when={currentIdx === TabItem.Preview}>
                        <Preview></Preview>
                    </Match.Option>
                    <Match.Option when={currentIdx === TabItem.Response}>
                        <div className={style.plain_text}>
                            <span>
                                {respStore.currentViewResp?.data}
                            </span>
                        </div>
                    </Match.Option>
                </Match>
            </RenderIf>
        </div>
    )
})

