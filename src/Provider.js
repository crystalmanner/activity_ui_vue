import { version, name } from '../package.json'
import activities from './store/modules/activities'
import statuses from './store/modules/statuses'
import types from './store/modules/types'
const pages = require.context('./pages', true, /\.vue$/)

export default () => {
  return {
    name,
    pages,
    // layouts: require.context('./layouts', false, /\.vue$/),
    store: {
      activities,
      statuses,
      types
    },
    version
  }
}
