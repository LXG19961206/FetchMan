import { Descriptions, Typography, Divider, Tag } from '@douyinfe/semi-ui';
import {Match} from "@/components/headerless/match";
import { useRespStore } from '@/store/resp';
import { Resp } from '@/models/resp';
import style from './index.module.less'
export default  () => {

    const respStore = useRespStore()
    const resp = respStore.currentView!

    return (
        <div className={style.header}>
            <Divider align='left' dashed margin={8}>
            </Divider>
            <Descriptions align={"left"} >
                <Descriptions.Item itemKey={"status"}>
                    <Match fallback={<> { resp.status } </>}>
                        <Match.Option when={ /2\d\d.*/.test(resp.status.toString() || "") }>
                            <Tag color={"green"}>{ resp.status }</Tag>
                        </Match.Option>
                        <Match.Option when={ /3\d\d.*/.test(resp.status.toString() || "") }>
                            <Tag color={"yellow"}>{ resp.status }</Tag>
                        </Match.Option>
                        <Match.Option when={ /[4|5]\d\d.*/.test(resp.status.toString() || "") }>
                            <Tag color={"red"}>{ resp.status }</Tag>
                        </Match.Option>
                    </Match>
                </Descriptions.Item>
            </Descriptions>
            <Typography.Title heading={6}  > Headers </Typography.Title>
            <Divider align='left' dashed margin={8}>
            </Divider>
            <Descriptions align={"left"} >
                {
                    Object.entries(resp.headers).map(([k,v], index) => (
                        <Descriptions.Item
                            key={index}
                            itemKey={k}> { v }
                        </Descriptions.Item>
                    ))
                }
            </Descriptions>
        </div>
    )

}


