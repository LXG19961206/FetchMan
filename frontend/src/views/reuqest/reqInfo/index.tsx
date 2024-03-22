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
        <TabPane tab="Pre-Script" itemKey="Pre-Script">
          {/* <Body></Body> */}
          <Script isPrev={true}></Script>
        </TabPane>
        <TabPane tab="Headers" itemKey="Headers">
            <Headers></Headers>
        </TabPane>
        <TabPane tab="Body" itemKey="Body">
          <Body></Body>
        </TabPane>
        <TabPane tab="Post-Script" itemKey="Post-Script">
          {/* <Body></Body> */}
          <Script isPrev={false}></Script>
        </TabPane>
      </Tabs>
    </div>
  )
}