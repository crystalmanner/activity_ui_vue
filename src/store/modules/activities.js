import makeRestStore from '@freshinup/core-ui/src/store/utils/makeRestStore'
import filter from 'lodash/filter'
export const _getItemPath = ({ id }) => `/activity/v1/activities/${id}`
export const _getItemsPath = () => `/activity/v1/activities`

export default ({ items, item }) => {
  let store = makeRestStore(
    'activities',
    { items, item },
    {
      itemsPath: _getItemsPath,
      itemPath: _getItemPath
    }
  )
  store.getters = {
    ...store.getters,
    itemsOfTypeNotAppointment (state, getters) {
      return filter(getters.items, (item) => {
        return item.type.id !== 5
      })
    },
    itemsOfTypeAppointment (state, getters) {
      return filter(getters.items, (item) => {
        return item.type.id === 5
      })
    }
  }
  const { ...rest } = store
  return {
    ...rest,
    namespaced: true
  }
}
