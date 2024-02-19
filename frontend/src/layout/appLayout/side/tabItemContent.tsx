import { IconFile } from '@douyinfe/semi-icons';

type SemiIcon = typeof IconFile

const style = {
  container: { width: '75px',textAlign: 'center' },
  title: { fontSize: '12px', color: '#777' },
  iconSize: 'large'
} as const 

type Props = { title: string, Icon: SemiIcon }

export default ({ title, Icon }: Props) => {
  return (
    <div style={ style.container }>
      <Icon size={ style.iconSize }></Icon>
      <p style={style.title}> { title } </p>
    </div>
  )
}