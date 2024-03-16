import { Input, Tag } from "@douyinfe/semi-ui"
import React from "react"
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom'

type OrginInputType = Omit<Parameters<typeof Input>[0], 'onChange' | 'onBlur' | 'onFocus'>

type HasDict = {
  dict?: {
    [key: string]: string
  },
  onChange: (value: string) => void
  onBlur?: (evt: React.FocusEvent<HTMLElement>) => void
  onFocus?: (evt: React.FocusEvent<HTMLElement>) => void
}

const debounce = (fn: Function, delay: number, self: unknown) => {

  let timerId: null | number = null

  return (...args: []) => {

    if (timerId) clearInterval(timerId)

    timerId = window.setTimeout(() => {
      fn.call(self, ...args)
      timerId = null
    }, delay)

  }

}

type Props = OrginInputType & HasDict


export class InjectInput extends React.Component<Props> {

  state: Readonly<{ html: string, lastPostion: number }> = {
    html: "",
    lastPostion: 0
  }

  setCursorPosition() {
    let offset = this.state.lastPostion || 0
    let currentOffset = 0;
    let foundNode = null;
    let newOffset = 0

    if (!this.inputRef.current) return

    for (let child of this.inputRef.current.childNodes) {

      if (child.nodeType !== Node.TEXT_NODE) {
        child = child.firstChild as ChildNode
      }

      const remainingTextLength = child.textContent?.length || 0;

      if (currentOffset + remainingTextLength >= offset) {
        // 找到应该放置光标的文本节点
        foundNode = child;
        newOffset = offset - currentOffset;
        break;
      } else {
        // 继续遍历下一个节点
        currentOffset += remainingTextLength;
      }
    }

    if (foundNode) {
      const range = document.createRange();
      range.setStart(foundNode, newOffset);
      range.collapse(true); // 折叠范围以使其成为一个插入点

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  getPostion() {
    const selection = document.getSelection() || window.getSelection()
    console.log(selection?.anchorOffset)
    const el = selection?.anchorNode
    const offset = selection?.anchorOffset || 0
    if (!el) return 0
    let pos = 0
    for (let node of el.childNodes) {
      if (node === el) {
        pos += offset
        break
      }
      pos += node.textContent?.length || 0
    }
    this.setState({
      lastPostion: pos
    })
  }

  static getChildren(el: HTMLElement, ret: ChildNode[] = []): ChildNode[] {
    for (let child of el.childNodes) {
      if (child.nodeType !== Node.TEXT_NODE && child?.childNodes?.length) {
        ret.push(child.firstChild as ChildNode)
      } else if (child.nodeType === Node.TEXT_NODE) {
        ret.push(child)
      } else {
      }
    }
    return ret
  }

  shouldComponentUpdate(nextProps: Readonly<Props>,): boolean {
    return this.inputRef.current?.innerText !== nextProps.value
    // return false
  }

  // componentDidUpdate(prevProps: Readonly<Props>): void {
  //   if (prevProps.value !== this.props.value) {
  //     this.parseAndSync()
  //     // this.setCursorPosition()
  //   }
  // }

  constructor(
    props: Props,
    public inputRef: React.RefObject<HTMLDivElement>,
    public delayUpdateView: () => void
  ) {
    super(props)
    this.inputRef = React.createRef<HTMLDivElement>()
    this.delayUpdateView = debounce(this.updateView, 1000, this);
  }

  change = () => {
    const el = this.inputRef.current
    const value = el?.innerText || ''
    this.props.onChange?.call(void 0, value)
    console.log(
      document.getSelection()?.anchorOffset
    )
    // const updateAtOnce = /[^\{]+\}\}.{0,1}$/.test(value)
    // if (updateAtOnce) {
    this.updateView()
    // } else {
    // this.delayUpdateView()
    // }
    // this.updateView()

  }

  blur = (evt: React.FocusEvent<HTMLElement>) => {
    // this.parseAndSync()
    this.props?.onBlur?.call(void 0, evt)
  }

  parseAndSync() {
    // this.setState((prev) => ({
    //   ...prev,
    //   html: this.transPlainText2Highlight(this.inputRef.current?.innerText || '')
    // }))

  }

  updateView() {
    this.getPostion()
    this.parseAndSync()
    this.setCursorPosition()
  }

  transPlainText2Highlight(value: string) {
    const div = document.createElement('div')
    const chunkViews = [] as React.ReactNode[]
    String(value).split(/(\{\{[^\}]*\}\})/).forEach((token) => {
      if (!token) {
        return
      } else if (/(\{\{([^\}]*)\}\})/.test(token)) {
        const varName = token.replace(/\{\{([^\}]*)\}\}/g, '$1').trim()
        chunkViews.push(<span style={{ background: 'orange', color: '#fff', fontSize: '12px' }}>{`{{${varName}}}`} </span>)
      } else {
        chunkViews.push(<> {token.trim()} </>)
      }
    })
    render(<React.Fragment> {chunkViews} </React.Fragment>, div)
    const html = div.innerHTML
    unmountComponentAtNode(div)
    div.remove()
    return html
  }

  render() {
    return (
      <div
        ref={this.inputRef}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
        spellCheck={this.props.spellCheck}
        className={this.props.className}
        // style={this.props.style}
        style={{ width: '400px', height: '400px', border: '1px solid #ccc' }}
        contentEditable
        onBlur={evt => this.blur(evt)}
        onInput={this.change}>
        {/* { this.props.value } */}
      </div>
    )
  }

}