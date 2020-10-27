import makeRestStore from '@freshinup/core-ui/src/store/utils/makeRestStore'
export const _getItemPath = ({ id }) => `/activity/v1/types/${id}`
export const _getItemsPath = () => `/activity/v1/types`

export default ({ items, item }) => {
  let store = makeRestStore(
    'types',
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
