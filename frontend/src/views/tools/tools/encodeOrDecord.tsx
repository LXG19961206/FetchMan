import { useCallback, useState } from 'react';
import style from './index.module.less'
import { Input, TextArea, Button } from '@douyinfe/semi-ui';
import { RenderIf } from '@/components/headerless/renderIf';
import { compose } from 'lodash/fp'

interface EncodeDecodeHandler {
  (content: string): string
}

const EMPTY_HANDLER = (val: string) => val

export default (props: {
  encodeHandler: EncodeDecodeHandler,
  decodeHandler?: EncodeDecodeHandler,
  supportKey?: boolean,
  suportIV?: boolean,
  supportBinary?: boolean
}) => {

  const [input, setInput] = useState('')
  const [key, setKey] = useState('')
  const [iv, setIv] = useState('')
  const [output, setOutput] = useState("")
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>()

  const encode = compose(setOutput, props.encodeHandler)
  const decode = compose(setOutput, props.decodeHandler || EMPTY_HANDLER)

  return (
    <div className={style.wrapper} ref={setWrapper}>
      <div className={style.code_area}>
        <p> Content </p>
        <TextArea
          placeholder='Enter your content to encode...'
          value={input}
          autosize
          onChange={setInput}>
        </TextArea>
        <RenderIf when={!!props.supportKey}>
          <p> Key </p>
          <Input
            placeholder='Enter your encode secret key...'
            value={key}
            onChange={setKey}>
          </Input>
        </RenderIf>
        <RenderIf when={!!props.suportIV}>
          <p> IV </p>
          <Input
            placeholder='Enter your IV...'
            value={iv}
            type="number"
            onChange={setIv}>
          </Input>
        </RenderIf>
        <div className={style.btn_group}>
          <Button type="primary" onClick={encode.bind(void 0, input)}> Encode </Button>
          <RenderIf when={!!props.decodeHandler}>
            <Button
              onClick={decode.bind(void 0, input)} 
              type='primary'> Decode 
            </Button>
          </RenderIf>
        </div>
      </div>
      <div className={style.code_area}>
        <p> Result </p>
        <TextArea
          autosize
          value={output}
          style={{ height: 'auto' }} />
      </div>
    </div>

  )
}
