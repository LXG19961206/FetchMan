import Menu from './envCollection'
import style from './index.module.less'
import { observer } from 'mobx-react'
import Vars from './var/vars'
import { InjectInput } from './injectVarInput/other';
import { useState } from 'react';

export default observer(() => {

  const [text, setT] = useState('')

  return (
    <div
      className={style.wrapper}>
      <Menu></Menu>
      {/* <InjectInput onChange={setT}></InjectInput> */}
      <Vars></Vars>
    </div>
  )
})