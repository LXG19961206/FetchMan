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
import Xml from './bodyType/xml'
import Html from './bodyType/html';

export default () => {

  const reqStore = useRequestStore()
  const [bodyType, setBodyType] = useState((() => {
    const current = reqStore.currentViewRequest
    const contentType = reqStore.getContentType()
    if (!current) {
      return BodyTypeDict.text
    } else if (current.isBinary) {
      // 是否是二进制文件其实主要是我之前上传文件的时候就对该条请求进行了标识
      return BodyTypeDict.binary
    } else if (current.isFormData) {
      return BodyTypeDict.formData
    } else if (contentType.indexOf(ContentType.FormUrl) > -1) {
      return BodyTypeDict.formUrl
    } else if (contentType.indexOf(ContentType.Json) > -1) {
      return BodyTypeDict.json
      // xml的类型值比较多，只能判读其中包含 xml 字符串
    } else if (contentType.indexOf(ContentType.XmlCommonSign) > -1) {
      return BodyTypeDict.xml
    } else if (contentType.indexOf(ContentType.Html) > -1) {
      return BodyTypeDict.html
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
    [BodyTypeDict.xml]: Xml,
    [BodyTypeDict.html]: Html,
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





