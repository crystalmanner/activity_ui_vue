import activities, {
  _getItemPath,
  _getItemsPath
} from '~/store/modules/activities'
import { FIXTURE_ACTIVITIES } from 'tests/__data__/activities'

describe('activities Store', () => {
  test('the state has items', () => {
    const item = {}
    const items = []
    const result = activities({ items, item })
    expect(result).toHaveProperty('state')
    expect(result.state).toHaveProperty('items', items)
  })

  test('the state has item', () => {
    const item = {}
    const items = []
    const result = activities({ items, item })
    expect(result).toHaveProperty('state')
    expect(result.state).toHaveProperty('item', item)
  })

  test('is a namespaced module', () => {
    let item = {}
    let items = []
    const result = activities({ items, item })
    expect(result).toHaveProperty('namespaced', true)
  })

  test('items url', () => {
    expect(_getItemsPath()).toEqual(
      `/activity/v1/activities`
    )
  })
  test('item url', () => {
    expect(_getItemPath({ id: 1 })).toEqual(`/activity/v1/activities/1`)
  })
  describe('getters', () => {
    describe('itemsOfTypeNotAppointment', () => {
      test('returns all the items not with type of Appointment', () => {
        const storeModule = activities({ items: { data: FIXTURE_ACTIVITIES } })
        const results = storeModule.getters.itemsOfTypeNotAppointment(storeModule.state, {
          items: FIXTURE_ACTIVITIES
        })
        expect(results).toHaveLength(69)
      })
      test('returns empty array even if there are no items', () => {
        const storeModule = activities({ items: { data: FIXTURE_ACTIVITIES } })
        const results = storeModule.getters.itemsOfTypeNotAppointment(storeModule.state, {
          items: []
        })
        expect(results).toHaveLength(0)
      })
    })
    describe('itemsOfTypeAppointment', () => {
      test('returns all the items with type of Appointment', () => {
        const storeModule = activities({ items: { data: FIXTURE_ACTIVITIES } })
        const results = storeModule.getters.itemsOfTypeAppointment(storeModule.state, {
          items: FIXTURE_ACTIVITIES
        })
        expect(results).toHaveLength(31)
      })
      test('returns empty array even if there are no items', () => {
        const storeModule = activities({ items: { data: FIXTURE_ACTIVITIES } })
        const results = storeModule.getters.itemsOfTypeAppointment(storeModule.state, {
          items: []
        })
        expect(results).toHaveLength(0)
      })
    })
  })
})
