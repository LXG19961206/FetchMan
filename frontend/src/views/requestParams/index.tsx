import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { createStyle, percent, px } from '@/style';
import { paddingX, Reset } from '@/style/common';
import AttrsTable, { Source } from "./attrsTable";
import { ReqContext } from '@/context'
import {useContext, useMemo} from "react";
import {Body} from "./body";



export default () => {

  const reqCtx = useContext(ReqContext)


  const syncHeaders = (payload: Source) => {
    reqCtx.setHeaders(
        payload.filter(item => !!item.Key).map(item => [item.Key, item.Value])
    )
  }

  const headersGetter = useMemo(() => {
    return (reqCtx.headers || []).map((item,i) => ({
      key: i,
      Key: item[0],
      Value: item[1] || '',
      Description: ""
    })) as Source
  }, [reqCtx.headers])

  const paramsGetter = useMemo(() => {
    return Object.entries(reqCtx.params).map(([k,v], i) => ({
      key: i,
      Key: k,
      Value: v || '',
      Description: ""
    }))
  }, [reqCtx.params])

  const syncParams = (payload: Source) => {
    reqCtx.setParams(
        payload.filter(item => !!item.Key)
            .reduce((prev, item) => ({...prev, [item.Key]: item.Value}),{})
    )
  }

  return (<div>
    <Tabs type="line" style={style.wrapper} lazyRender>
      <TabPane tab="Params" itemKey="1">
        <AttrsTable
            getter={paramsGetter}
            syncHandler={syncParams}></AttrsTable>
      </TabPane>
      <TabPane tab="Authorization" itemKey="2">
        <h3>快速起步</h3>
        <pre
            style={{
              margin: '24px 0',
              padding: '20px',
              border: 'none',
              whiteSpace: 'normal',
              borderRadius: 'var(--semi-border-radius-medium)',
              color: 'var(--semi-color-text-1)',
              backgroundColor: 'var(--semi-color-fill-0)',
            }}
        >
          <code>
            yarn add @douyinfe/semi-ui
          </code>
        </pre>
      </TabPane>
      <TabPane tab={`Headers(${Object.keys(reqCtx.headers).length})`} itemKey="3">
        <AttrsTable getter={headersGetter} syncHandler={syncHeaders}></AttrsTable>
      </TabPane>
      <TabPane tab="Body" itemKey="4">
        <Body></Body>
      </TabPane>
      <TabPane tab="Pre Request Script" itemKey="5">
        <h3>帮助</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
          Q：有新组件需求、或者现有组件feature不能满足业务需求？
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
          右上角问题反馈，提交issue，label选择Feature Request / New Component Request
          我们会高优处理这些需求。
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
          Q：对组件的使用有疑惑？
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
          欢迎进我们的客服lark群进行咨询提问。
        </p>
      </TabPane>
      <TabPane tab="Tests" itemKey="6">
        <h3>帮助</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
          Q：有新组件需求、或者现有组件feature不能满足业务需求？
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
          右上角问题反馈，提交issue，label选择Feature Request / New Component Request
          我们会高优处理这些需求。
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
          Q：对组件的使用有疑惑？
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
          欢迎进我们的客服lark群进行咨询提问。
        </p>
      </TabPane>
      <TabPane tab="Settings" itemKey="7">
        <h3>帮助</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
          Q：有新组件需求、或者现有组件feature不能满足业务需求？
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
          右上角问题反馈，提交issue，label选择Feature Request / New Component Request
          我们会高优处理这些需求。
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
          Q：对组件的使用有疑惑？
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
          欢迎进我们的客服lark群进行咨询提问。
        </p>
      </TabPane>
    </Tabs>
  </div>)
};

const style = {
  wrapper: createStyle({
    width: percent(100),
    ...Reset,
    ...paddingX(px(10))
  })
}
