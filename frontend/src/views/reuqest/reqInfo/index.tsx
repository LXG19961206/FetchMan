import { Tabs, TabPane } from '@douyinfe/semi-ui'
import Params from './params'
import Headers from './headers'
import Body from './body'
import Script from '../scripts/script'
import { useEffect } from 'react'
export default () => {

  useEffect(() => {

  }, [])

  return (
    <div>
      <Tabs type="line" lazyRender>
        <TabPane tab="Params" itemKey="Params">
          <Params></Params>
        </TabPane>
        <TabPane tab="Headers" itemKey="Headers">
            <Headers></Headers>
        </TabPane>
        <TabPane tab="Body" itemKey="Body">
          <Body></Body>
        </TabPane>
        <TabPane tab="ScriptAfterReqeust" itemKey="ScriptAfterReqeust">
          {/* <Body></Body> */}
          <Script></Script>
        </TabPane>
      </Tabs>
    </div>
  )
}