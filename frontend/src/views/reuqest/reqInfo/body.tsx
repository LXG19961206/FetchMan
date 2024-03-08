import StrategyPattern from '@/components/headerless/strategyPattern';
import { BodyTypeDict } from '@/dicts/body';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';
import { Fragment, useState } from 'react';
import { Json } from './bodyType/json'
import { None } from './bodyType/none'
import PlainText from './bodyType/plainText'
import FormUrl from './bodyType/formUrl'
import style from './body.module.less'
import Binary from './bodyType/binary';
import FormDataComp from './bodyType/formData'
import { useRequestStore } from '@/store/request';
import { ContentType } from '@/dicts/contentType';

export default () => {

  const reqStore = useRequestStore()
  const [bodyType, setBodyType] = useState((() => {
    const current = reqStore.currentViewRequest
    if (!current) {
      return BodyTypeDict.text
    } else if (current.isBinary) {
      return BodyTypeDict.binary
    } else if (current.isFormData) {
      return BodyTypeDict.formData
    } else if (reqStore.getContentType().indexOf(ContentType.FormUrl) > -1) {
      return BodyTypeDict.formUrl
    } else if (reqStore.getContentType().indexOf(ContentType.Json) > -1) {
      return BodyTypeDict.json
    } else {
      return BodyTypeDict.text
    }
  })())

  return (
    <Fragment>
      <RadioGroup
        value={bodyType}
        onChange={e => setBodyType(e.target.value)}>
        {
          Object.entries(BodyTypeDict).map(([type, value]) => (
            <Radio key={type} value={value}> {value} </Radio>
          ))
        }
      </RadioGroup>
      <BodyHandleView bodyType={bodyType}></BodyHandleView>
    </Fragment>

  )
}


const BodyHandleView = (props: { bodyType: string }) => {

  const strategies = {
    [BodyTypeDict.binary]: Binary,
    [BodyTypeDict.none]: None,
    [BodyTypeDict.text]: PlainText,
    [BodyTypeDict.formUrl]: FormUrl,
    [BodyTypeDict.json]: Json,
    [BodyTypeDict.formData]: FormDataComp,
    default: Fragment
  }

  return (
    <div className={style.body_content}>
      <StrategyPattern
        strategies={strategies}
        value={props.bodyType}>
      </StrategyPattern>
    </div>
  )
}





