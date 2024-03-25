import { useCallback, useEffect, useState } from 'react';
import style from './index.module.less'
import { Input, TextArea, Button, Switch, Notification } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons'
import { RenderIf } from '@/components/headerless/renderIf';
import { compose } from 'lodash/fp'
import { ClipboardSetText } from '~/runtime/runtime'

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
  const [binaryMode, setBinaryMode] = useState(false)

  const encode = compose(setOutput, props.encodeHandler)
  const decode = compose(setOutput, props.decodeHandler || EMPTY_HANDLER)

  useEffect(() => {
    if (!output) return 
    ClipboardSetText(output).then(res => {
      Notification.success({ content: 'Trans success and copy result to clipboard' })
    })
  }, [output])

  return (
    <div className={style.wrapper} ref={setWrapper}>
      <div className={style.code_area}>
        <p> Content
          <RenderIf when={!!props.supportBinary}>
            <Switch
              checkedText="bin"
              uncheckedText="txt"
              className={style.at_right}
              size='large'
              checked={binaryMode}
              onChange={setBinaryMode}>
            </Switch>
          </RenderIf>
        </p>
        <RenderIf
          fallback={<Button> upload </Button>}
          when={!binaryMode}>
          <TextArea
            placeholder='Enter your content to encode...'
            value={input}
            autosize
            onChange={setInput}>
          </TextArea>
        </RenderIf>
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
        <p> Result 
          <IconCopy className={style.icon}></IconCopy>
        </p>
        <TextArea
          autosize
          value={output}
          style={{ height: 'auto' }} />
      </div>
    </div>

  )
}
