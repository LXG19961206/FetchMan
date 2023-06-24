import { Tree, Typography } from '@douyinfe/semi-ui';
import TreeNode from '@douyinfe/semi-ui/lib/es/tree/treeNode';
import { Colors, createStyle, Display, px, TextAlign, vh } from '../../style';
import { border, marginX, marginY, paddingX, paddingY } from '../../style/common';

const treeData = [{
  label: '2022/12/01 09:23',
  value: '2022/12/01 09:23',
  key: '0',
  children: [{
    label: 'http://api.github.com',
    value: 'http://api.github.com',
    key: '01',
  }, {
    label: 'http://api.github.com',
    value: 'http://api.github.com',
    key: '02',
  }, {
    label: 'http://api.github.com',
    value: 'http://api.github.com',
    key: '03',
  }]
}, {
  label: '2022/12/01 09:23',
  value: '2022/12/01 09:23',
  key: '1',
  children: [{
    label: 'http://api.github.com',
    value: 'http://api.github.com',
    key: '11',
  }, {
    label: 'http://api.github.com',
    value: 'http://api.github.com',
    key: '12',
  }, {
    label: 'http://api.github.com',
    value: 'http://api.github.com',
    key: '13',
  }]
}]

export default () => {
  return (
    <Tree
      style={style.tree}
      treeData={treeData}>
    </Tree>
  )
}

const style = {
  tree: createStyle({
    height: vh(100),
    width: px(305),
    borderRight: border(px(1), Colors.Gainsboro)
  }),
  label: createStyle({
    fontSize: px(12),
    color: Colors.DarkSalmon,
  }),
  tag: createStyle({
    display: Display.inlineBlock,
    background: Colors.Green,
    color: Colors.White,
    textAlign: TextAlign.center,
    fontWeight: 600,
    ...marginY(0),
    ...marginX(px(5)),
    ...paddingX(px(6)),
    ...paddingY(px(3))
  })
}

const renderLabel = (
  label?: React.ReactNode
) => (
  <Typography.Text 
    ellipsis={{ showTooltip: true }} 
    style={style.label}>
    <span style={style.tag}> GET </span>
    { label }
  </Typography.Text>
)
