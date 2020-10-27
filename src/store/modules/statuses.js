import makeRestStore from '@freshinup/core-ui/src/store/utils/makeRestStore'
export const _getItemPath = ({ id }) => `/activity/v1/statuses/${id}`
export const _getItemsPath = () => `/activity/v1/statuses`

export default ({ items, item }) => {
  let store = makeRestStore(
    'statuses',
    { items, item },
    {
      itemsPath: _getItemsPath,
      itemPath: _getItemPath
    }
  )

  const { namespaced, ...rest } = store
  return {
    namespaced: true,
    ...rest
  }
}
