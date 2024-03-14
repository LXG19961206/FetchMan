import style from './index.module.less'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Input, Tag, Tooltip, Modal, Table, Button } from '@douyinfe/semi-ui'
import { RenderIf } from '@/components/headerless/renderIf'
import { IconBranch, IconSearch } from '@douyinfe/semi-icons'
import { useEnvStore } from '@/store/var'
import { set } from 'lodash'

type OrginInputType = Omit<Parameters<typeof Input>[0], 'onChange'>

type HasDict = {
  dict?: {
    [key: string]: string
  },
  onChange: (value: string) => void
}
type Props = OrginInputType & HasDict


export const OptionSelector = (props: {
  options: Record<string, string>,
  show: boolean,
  onClose: () => void,
  onConfirm?: (res: string) => void
}) => {

  const [filterKey, setFilter] = useState("")

  const tableData = useMemo(() => (
    Object.entries(props.options)
      .filter(([name]) => filterKey ? name.indexOf(filterKey) > -1 : true)
      .map(([name, value]) => ({ name, value }))
  ), [props.options, filterKey])

  const ok = (value: string) => {
    props.onConfirm?.call(void 0, value)
    props.onClose()
  }

  return (
    <Modal
      className={style.option_selector}
      title="use a variable"
      style={{ width: '700px' }}
      hasCancel={false}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={props.onClose}
      visible={props.show}
      closeOnEsc={true}>
      <Input
        spellCheck={false}
        defaultValue={filterKey}
        onBlur={(evt) => setFilter(evt.target.value)}
        className={style.search_input}
        placeholder={"enter keywords of target variable"}
        prefix={<IconSearch />}>
      </Input>
      <Table
        size='small'
        dataSource={tableData}>
        <Table.Column
          title="variable name"
          dataIndex='name'
          width={150}
          key="name"></Table.Column>
        <Table.Column
          width={400}
          title="variable value"
          dataIndex='value'
          key="value">
        </Table.Column>
        <Table.Column
          fixed="right"
          title="action"
          render={(_, record) => <Button onClick={() => ok(record.name)} type="primary"> use </Button>}>
        </Table.Column>
      </Table>
    </Modal>
  )


}

export default function <T = string>(props: Props) {

  const [isEditMode, setEditMode] = useState(false)
  const envStore = useEnvStore()
  const [richText, setRichText] = useState<React.ReactNode[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showSelector, setSelectorShow] = useState(false)
  const lastIdx = useRef<number>(0)

  const blur = (evt: React.FocusEvent<HTMLInputElement, Element>) => {
    setEditMode(false)
    updateRichText()
    props.onBlur?.call(void 0, evt)
  }

  const focus = (evt: React.FocusEvent<HTMLInputElement, Element>) => {
    lastIdx.current = inputRef.current?.selectionStart || 0
    props.onFocus?.call(void 0, evt)
  }

  const updateRichText = () => {
    const chunkViews: React.ReactNode[] = []
    String(props.value).split(/(\{\{[^\}]*\}\})/).forEach((token) => {
      if (!token) {
        return
      } else if (/(\{\{([^\}]*)\}\})/.test(token)) {
        const varName = token.replace(/\{\{([^\}]*)\}\}/g, '$1').trim()
        chunkViews.push(
          varName in envStore.currentVarDict
            ? (
              <Tooltip
                content={`current value: ${envStore.getVar(varName)}`}>
                <Tag className={style.var} size='large' color="orange"> ${varName} </Tag>
              </Tooltip>
            )
            : (
              <Tooltip
                content={`variable not exist: ${varName}`}>
                <Tag className={style.var_not_exist} size='large' color="red"> ${varName} </Tag>
              </Tooltip>
            )
        )
      } else {
        chunkViews.push(<> {token} </>)
      }
    })
    setRichText(() => {
      return chunkViews
    })
  }

  const focusInput = () => {
    setEditMode(true)
    setTimeout(() => {
      (document.activeElement as HTMLInputElement)?.blur()
      inputRef.current?.focus()
    })
  }

  const onClick = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    props.onClick?.call(void 0, evt)
    lastIdx.current = inputRef.current?.selectionStart || 0
  }

  const onInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    props.onInput?.call(void 0, evt)
    lastIdx.current = inputRef.current?.selectionStart || 0
  }

  const inject = (val: string) => {
    if (!inputRef.current) return 
    const variable = `{{${val}}}`
    let newValue = ""
    if (!lastIdx) {
      newValue = inputRef.current?.value + variable
    } else {
      const prevValue = inputRef.current?.value || ''
      newValue = prevValue.slice(0, lastIdx.current) + variable + prevValue.slice(lastIdx.current)
    }
    inputRef.current.value = newValue
    props.onChange(newValue)
    updateRichText()
  }

  useEffect(() => {
    updateRichText()
    if ([null, undefined].includes(props.value as never)) return
    if (!inputRef.current) return
    inputRef.current.value = props.value as string
  }, [props.value])

  useEffect(() => {
    updateRichText()
  }, [])

  return (
    <React.Fragment>
      <OptionSelector
        onConfirm={inject}
        options={envStore.currentVarDict}
        onClose={() => setSelectorShow(false)}
        show={showSelector}>
      </OptionSelector>
      <RenderIf
        fallback={
          <div
            className={
              `${style.fake_input_div} ${style.input_like} ${props.className} ${richText.length === 0 ? style.empty : ''}`
            }
            style={{ ...props.style }}
            onClick={focusInput}>
            {richText.length === 0 ? <> Please input... </> : <></>}
            {richText.map((item, i) => <React.Fragment key={i}> {item} </React.Fragment>)}
          </div>
        }
        when={!!isEditMode || showSelector}>
        <Input
          {...props}
          ref={inputRef}
          suffix={
            <Tooltip content="inject varible">
              <IconBranch
                onClick={() => setSelectorShow(true)}
                className={style.injecter}
              />
            </Tooltip>
          }
          onInput={onInput}
          onClick={onClick}
          onFocus={focus}
          spellCheck={false}
          className={props.className || "" + " " + style.input_like}
          onBlur={blur}
          value={props.value}>
        </Input>
      </RenderIf>
    </React.Fragment>
  )
}