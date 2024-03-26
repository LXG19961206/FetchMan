import { useCallback, useEffect, useState } from 'react';
import style from './index.module.less'
import { Input, TextArea, Button, Switch, Notification } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons'
import { RenderIf } from '@/components/headerless/renderIf';
import { compose } from 'lodash/fp'
import { ClipboardSetText } from '~/runtime/runtime'

// maybe async
interface EncodeDecodeHandler {
  (content: string): string | Promise<string>
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

  const encode = async (content: string) => {
    setOutput(await props.encodeHandler(content))
  }

  const decode = async (content: string) => {
    if (!props.decodeHandler) return ""
    setOutput(await props.decodeHandler(content))
  }

  const copy = (content: string) => {
    ClipboardSetText(content).then(res => {
      Notification.success({ content: 'copy content to clipboard' })
    })
  }

  return (
    <div className={style.wrapper} ref={setWrapper}>
      <div className={style.code_area}>
        <div className={style.title}> Content
          <IconCopy onClick={() => copy(input)} className={style.icon}></IconCopy>
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
        </div>
        <RenderIf
          fallback={<Button> upload </Button>}
          when={!binaryMode}>
          <TextArea
            placeholder='Enter your content to encode...'
            value={input}
            spellCheck={false}
            showClear
            onClear={() => setInput("")}
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
        <div className={style.title}> Result 
          <IconCopy onClick={() => copy(output)} className={style.icon}></IconCopy>
        </div>
        <TextArea
          autosize
          value={output}
          style={{ height: 'auto' }} />
      </div>
    </div>

  )
}
