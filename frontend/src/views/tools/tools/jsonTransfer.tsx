import { useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage, StreamParser } from '@codemirror/language';
import style from './index.module.less'
import { pipe } from 'lodash/fp'
import JsonEditor from '@/components/jsonEditor/jsonEditor';

const valeCheck = (value: object) => {
  return Reflect.ownKeys(value).length > 0 ? value : null
}

export default (props: {
  transfer: (input: unknown) => string,
  lang: StreamParser<unknown>
}) => {

  const [input, _] = useState('')
  const [output, setOutput] = useState("")
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>()

  const trans = pipe(valeCheck, props.transfer, setOutput)
  return (
    <div className={style.wrapper} ref={setWrapper}>
      <div className={style.code_area}>
        <p> Input </p>
        <JsonEditor
          editMode
          onBlur={trans}
          height={ 'auto' }
          json={input}
        />
      </div>
      <div className={style.code_area}>
        <p> Result </p>
        <CodeMirror
          value={output}
          readOnly
          style={{ height: 'auto' }}
          extensions={[StreamLanguage.define(props.lang)]}
        />
      </div>
    </div>

  )
}
