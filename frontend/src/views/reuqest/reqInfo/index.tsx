import { Tabs, TabPane } from '@douyinfe/semi-ui'
import Params from './params'
import Headers from './headers'
import Body from './body'
import { useEffect } from 'react'
export default () => {

  useEffect(() => {

  }, [])

  return (
    <div>
      <Tabs type="line" lazyRender>
        <TabPane tab="Params" itemKey="1">
          <Params></Params>
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
        <TabPane tab="Headers" itemKey="3">
            <Headers></Headers>
        </TabPane>
        <TabPane tab="Body" itemKey="4">
          <Body></Body>
        </TabPane>
      </Tabs>
    </div>
  )
}