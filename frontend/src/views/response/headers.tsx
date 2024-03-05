import { Descriptions, Typography, Divider, Tag } from '@douyinfe/semi-ui';
import {createStyle, px} from "@/style";
import {Match} from "@/components/headerless/match";
import { useRespStore } from '@/store/resp';
export default  () => {

    const respStore = useRespStore()

    return (
        <div style={style.desc}>
            <Typography.Title heading={6} style={style.title} > First Line </Typography.Title>
            <Divider align='left' dashed margin={8}>
            </Divider>
            <Descriptions align={"left"} >
                {/* <Descriptions.Item itemKey={"version"}> { respContext.respProto } </Descriptions.Item> */}
                <Descriptions.Item itemKey={"status"}>
                    <Match fallback={<> respContext.respStatus </>}>
                        <Match.Option when={ /2\d\d .*/.test(respStore.currentViewResp?.status.toString() || "") }>
                            <Tag color={"green"}>{ respStore.currentViewResp?.status }</Tag>
                        </Match.Option>
                        <Match.Option when={ /3\d\d.*/.test(respStore.currentViewResp?.status.toString() || "") }>
                            <Tag color={"yellow"}>{ respStore.currentViewResp?.status }</Tag>
                        </Match.Option>
                        <Match.Option when={ /[4|5]\d\d.*/.test(respStore.currentViewResp?.status.toString() || "") }>
                            <Tag color={"red"}>{ respStore.currentViewResp?.status }</Tag>
                        </Match.Option>
                    </Match>
                </Descriptions.Item>
            </Descriptions>
            <Typography.Title heading={6} style={style.title} > Headers </Typography.Title>
            <Divider align='left' dashed margin={8}>
            </Divider>
            <Descriptions align={"left"} >
                {
                    Object.entries(respStore.currentViewResp!.headers).map(([k,v], index) => (
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

const style = {
    desc: createStyle({
        fontSize: px(12),
        margin: px(16),
        marginTop: px(8)
    }),
    title: createStyle({
        fontSize: px(15),
        marginBottom: px(8)
    })
}

