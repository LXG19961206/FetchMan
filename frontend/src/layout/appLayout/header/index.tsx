import style from './index.module.less'
import { Avatar, Input } from '@douyinfe/semi-ui'
import { IconSearch } from '@douyinfe/semi-icons';
export default () => {
  return (
    <div className={style.header_wrapper}>
      <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
        <Input 
          placeholder="enter keywords to search..."
          type="text" 
          size='large'
          style={{ width: '300px'}}
          suffix={<IconSearch></IconSearch>}>
        </Input>
        <Avatar
          style={{ margin: 4, background: '#33e3cf' }}>  刘 
        </Avatar>
      </div>
    </div>
  )
}