import {Button, Input, Select} from '@douyinfe/semi-ui';
import {useContext } from 'react';
import {Methods, Size} from '../../dicts';
import {BorderType, createStyle, Display, percent, px} from '../../style';
import {marginX, paddingX, Reset} from '../../style/common';
import { ReqContext, RespContext, StatusContext, TabsContext} from '../../context'
import {SimpleRequest, AddRequest, UpdateTabInfo} from "~/go/app/App";
import { endsWith } from 'lodash';


export default () => {

    const tabCtx = useContext(TabsContext)

    const reqContext = useContext(ReqContext)

    const respCtx = useContext(RespContext)

    const statusCtx = useContext(StatusContext)

    const postRequest = async () => {

        statusCtx.setLoading(true)

        statusCtx.setRespShowState(true)

        openNewTabIfCurrentIsLast()

        reqContext.updateTabInfo()

        let resp = await SimpleRequest(reqContext.createReqPayload())

        respCtx.respReset()

        reqContext.setId(0)

        reqContext.setHeaders(resp.ReqHeaders || [])

        respCtx.setRespStatus(resp.Status)

        respCtx.setRespCode(resp.Code)

        respCtx.setRespBody(resp.Body)

        respCtx.setBodyPath(resp.BodyPath)

        respCtx.setProto(resp.Proto)

        respCtx.setRespHeaders(resp.Headers)

        statusCtx.setLoading(false)

    }

    const openNewTabIfCurrentIsLast = () => {

        const tid = statusCtx.getTabId()

        if (tabCtx.isLastItem(tid)) {
            
            AddRequest(reqContext.createReqPayload()).then(res => {

                reqContext.setId(res)

                reqContext.updateTabInfo()

            })

            tabCtx.open()
            
        }
        tabCtx.setItem(tid, {
            id: tid, url: reqContext.url, method: reqContext.method || Methods.get
        })
    }

    return (
        <div style={style.wrapper}>
            <Select
                filter
                size={Size.large}
                defaultValue={Methods.get}
                onChange={ val => reqContext.setMethod(val as string) }
                style={{width: 150}}>
                {
                    Object.values(Methods).map(method => (
                        <Select.Option
                            size="large"
                            key={method}
                            value={method}> {method}
                        </Select.Option>
                    ))
                }
            </Select>
            <Input
                value={reqContext.url}
                onChange={reqContext.setUrl}
                onBlur={openNewTabIfCurrentIsLast}
                placeholder='Please enter your url' size={Size.large}>
            </Input>
            <Button
                style={style.button}
                size={Size.large}
                theme={BorderType.solid}
                onClick={postRequest}
                type='secondary'> Send
            </Button>
        </div>
    )
}

const style = {
    wrapper: createStyle({
        display: Display.flex,
        width: percent(100),
        ...Reset,
        ...paddingX(px(10))
    }),
    button: createStyle({
        ...marginX(px(4))
    })
}