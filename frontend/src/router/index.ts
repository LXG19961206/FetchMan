import { IconAppCenter, IconSend, IconGlobe } from '@douyinfe/semi-icons';
import Collection from '../views/collection'
import Env from '@/views/env'
import Tools from '@/views/tools';

export const RouterDict = {
  Collection: 'Collection',
  Environment: 'Environment',
  QuickRequest: 'QuickRequest',
  Tools: 'Tools'
} as const


export const Util = {
  GenerateFullPath: (...paths: string []) => {
    return paths.map(path => "/" + path).join('')
  },
  GenerateFullName: (...names: string []) => {
    return names.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join('')
  }
}




export const router = [
  {
    path: '/',
    redirect: Util.GenerateFullPath(RouterDict.Collection),
    name: '',
    title: '',
    icon: '',
    inSideMenu: false,
    element: Collection
  },
  {
    path: Util.GenerateFullPath(RouterDict.Collection),
    name: Util.GenerateFullName(RouterDict.Collection),
    title: RouterDict.Collection,
    icon: IconAppCenter,
    inSideMenu: true,
    element: Collection
  },
  {
    path: Util.GenerateFullPath(RouterDict.Environment),
    name: Util.GenerateFullName(RouterDict.Environment),
    title: RouterDict.Environment,
    icon: IconGlobe,
    inSideMenu: true,
    element: Env
  },
  {
    path: Util.GenerateFullPath(RouterDict.Tools),
    name: Util.GenerateFullName(RouterDict.Tools),
    title: 'Tools',
    icon: IconSend,
    inSideMenu: true,
    element: Tools
  },
]