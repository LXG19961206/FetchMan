import style from './layout.module.css'
import ResizeableWrapper from '../../components/resizeableWrapper/resizeableWrapper'
import VariableTable from '../../components/variableTable'
import Side from '../../views/side'

export default () => {
  return (
    <div className={style.layout}>
      <div className={style.app_header}></div>
      <div className={style.app_content}>
        <div className={style.content_side_menu}>
          <Side></Side>
        </div>
        <div className={style.content_content_area}>
          <VariableTable source={[]}></VariableTable>
        </div>   
        <div className={style.content_folders}></div>
      </div>
    </div>
  )
}