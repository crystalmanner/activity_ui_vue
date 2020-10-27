import statuses, { _getItemPath, _getItemsPath } from '~/store/modules/types'

describe('Activity Types Store', () => {
  test('the state has items', () => {
    const item = {}
    const items = []
    const result = statuses({ items, item })
    expect(result).toHaveProperty('state')
    expect(result.state).toHaveProperty('items', items)
  })

  test('the state has item', () => {
    const item = {}
    const items = []
    const result = statuses({ items, item })
    expect(result).toHaveProperty('state')
    expect(result.state).toHaveProperty('item', item)
  })

  test('is a namespaced module', () => {
    let item = {}
    let items = []
    const result = statuses({ items, item })
    expect(result).toHaveProperty('namespaced', true)
  })

  test('items url', () => {
    expect(_getItemsPath()).toEqual(`/activity/v1/types`)
  })
  test('item url', () => {
    expect(_getItemPath({ id: 1 })).toEqual(`/activity/v1/types/1`)
  })
})
