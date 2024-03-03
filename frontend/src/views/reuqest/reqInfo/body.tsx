import StrategyPattern from '@/components/headerless/strategyPattern';
import { BodyTypeDict } from '@/dicts/body';
import { useRequestStore } from '@/store/request';
import { RadioGroup, Radio, Space, Tag, Button, Empty } from '@douyinfe/semi-ui';
import { Fragment, useRef, useState } from 'react';
import { RenderIf } from '@/components/headerless/renderIf';
import { Json } from './bodyType/json'
import { None } from './bodyType/none'
import PlainText from './bodyType/plainText'
import FormUrl from './bodyType/formUrl'
import style from './body.module.less'
import { NativeFileDialog } from '~/go/app/App';

export default () => {

  const [bodyType, setBodyType] = useState(BodyTypeDict.text)

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
    // [BodyTypeDict.formData]: MulForm,
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



const Binary = () => {

  const reqStore = useRequestStore()

  const cvs = useRef<HTMLCanvasElement>(null)

  const [base64, setBase64] = useState("")

  const [path, setPath] = useState("")

  const cancel = () => {
    setPath("")
    reqStore.setHeader('Content-Type', "")
    setBase64("")
    reqStore.setBody(null)
  }

  const upload = () => {
     cancel()
     NativeFileDialog({}, false).then(res => {
      debugger
        //  setPath(res.Path)
        //  reqStore.setHeader('Content-Type',res.ContentType)
        //  setBase64(res.File)
     })
  }


  // const shouldShowAsImage = (() => {

  //     console.log(!!base64 && /.*(image|video).*/.test(reqCtx.getContentType()))

  //     return !!base64 && /.*(image|video).*/.test(reqCtx.getContentType())

  // }, [base64])


  return (
    <Space vertical align={"start"}>
      <br />
      <RenderIf when={!!path}>
        <Tag onClose={cancel} closable size={"large"}> {path} </Tag>
      </RenderIf>
      <Button
        onClick={upload}
        type={"primary"}>
        upload
      </Button>
    </Space>
  )
}

// const Form = () => {

//   const reqCtx = useContext(ReqContext)

//   const formHandler = (source: Source) => {

//       const urlencoded = stringify(source.filter(item => item.Key)
//           .reduce((prev, item) => ({
//               ...prev, [item.Key]: item.Value
//           }), {}))

//       reqCtx.setBody({
//           Type: BodyTypeDict.form,
//           Value: urlencoded
//       })

//       reqCtx.setContentType("application/x-www-form-urlencoded")

//   }

//   const getter = useMemo((): Source => {
//       if (reqCtx.body?.Type === BodyTypeDict.form) {
//           return Object.entries(parse(reqCtx.body.Value || '')).map(([k,v], i) => ({
//               key: i, Key: k, Value: v as string, Description: ""
//           }))
//       } else {
//           return []
//       }
//   }, [reqCtx.body])


//   return <AttrsTable getter={getter} syncHandler={formHandler}></AttrsTable>

// }

// const MulForm = () => {

//   const reqCtx = useContext(ReqContext)

//   const mulFormHandler = (source: MulFormSource) => {
//       reqCtx.setBody({
//           Type: BodyTypeDict.formData,
//           FormData: source.filter(item => item.Type)
//               .map(item => ({
//                   Type: item.Type,
//                   Value: item.Value,
//                   Name: item.Key,
//                   FilePath: item.Type === BodyTypeDict.binary ? item.Value : ""
//               }))
//       })
//   }

//   const getter = useMemo(() => {
//       if (reqCtx.body?.Type !== BodyTypeDict.formData) {
//           return []
//       } else if (!reqCtx.body.FormData || !reqCtx.body.FormData.length) {
//           return []
//       } else {
//           return reqCtx.body.FormData
//               .filter(item => !!item && item.Name && item.Type)
//               .map((item,i) => ({
//               Type: item?.Type,
//               Key: item?.Name,
//               key: i, Description: '',
//               Value: item?.Type ===  BodyTypeDict.binary ? item?.FilePath : item?.Value
//           }))
//       }
//   }, [reqCtx.body]) as MulFormSource

//   return <MulFormData getter={getter} syncHandler={mulFormHandler}></MulFormData>

// }




