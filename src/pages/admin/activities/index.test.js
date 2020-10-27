import { mount } from 'vue-cli-plugin-freshinup-ui/utils/testing'
import SimpleConfirm from '@freshinup/core-ui/src/components/FSimpleConfirm'
import { PopulatedList5Items as Page } from './index.stories'
import { FIXTURE_STATUSES, FIXTURE_ACTIVITIES } from 'tests/__data__/activities'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

const routes = [{ path: '/foo' }]

const router = new VueRouter({
  routes
})

describe('Activity list main page', () => {
  describe('Visuals', () => {
    test('renders page', done => {
      const wrapper = mount(Page())
      wrapper.beforeRouteEnterOrUpdate({}, null, async () => {
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.statuses).toHaveLength(FIXTURE_STATUSES.length)
        expect(wrapper.vm.activities).toHaveLength(5)
        expect(wrapper.element).toMatchSnapshot()
        done()
      })
    })
    test('pageTitle defaults to Activity Main Page', (done) => {
      const wrapper = mount(Page())
      wrapper.beforeRouteEnterOrUpdate({}, null, async () => {
        await wrapper.vm.$nextTick()
        expect(wrapper.find('h2').text()).toEqual('Activity Worksheet')
        done()
      })
    })
  })
  describe('Methods', () => {
    test('onEdit', async () => {
      const wrapper = mount(Page(), {
        router
      })
      wrapper.vm.onEdit(FIXTURE_ACTIVITIES[0])
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$route.path).toEqual(`/admin/activities/${FIXTURE_ACTIVITIES[0].uuid}/edit`)
    })
    test('onView', async () => {
      const wrapper = mount(Page(), {
        router
      })
      wrapper.vm.onView(FIXTURE_ACTIVITIES[0])
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$route.path).toEqual(`/admin/activities/${FIXTURE_ACTIVITIES[0].uuid}`)
    })
    test('onDelete', async () => {
      const wrapper = mount(Page())
      wrapper.vm.onDelete(FIXTURE_ACTIVITIES[0])
      await wrapper.vm.$nextTick()
      const simpleConfirm = wrapper.find(SimpleConfirm)
      expect(simpleConfirm.exists()).toBe(true)
      expect(wrapper.vm.deleteDialog).toBeTruthy()
      expect(wrapper.vm.deletables).toBeTruthy()
    })
    test('onPaginate() invokes sort in the state and is reflected on the list', async () => {
      const wrapper = mount(Page())
      await wrapper.vm.onPaginate({ sortBy: 'scheduled_at', descending: false })
      expect(wrapper.apiMocked.history.get[0].params['sort']).toEqual('scheduled_at')
    })
    test('filterActivities()', async () => {
      const actions = {
        setSort: jest.fn(),
        setFilters: jest.fn()
      }
      const getters = {
        pagination: () => ({}),
        sorting: () => ({})
      }
      const store = new Vuex.Store({
        modules: {
          activities: {
            namespaced: true,
            actions,
            getters
          },
          permissions: {
            namespaced: true,
            state: {
              adminActivityList: {}
            }
          }
        }
      })
      const wrapper = mount(Page(), {
        store,
        mocks: {
          $route: {
            query: {}
          }
        }
      })
      wrapper.vm.filterActivities({
        some: 'thing'
      })
      expect(actions.setSort).not.toHaveBeenCalled()
      wrapper.vm.filterActivities({
        sort: 'test'
      })
      expect(actions.setSort).toHaveBeenCalled()
    })
    test('deleteActivities()', async () => {
      const wrapper = mount(Page(), {
        mocks: {
          $route: {
            query: {}
          }
        }
      })

      await wrapper.vm.deleteActivities()
      expect(wrapper.apiMocked.history.delete).toHaveLength(0)
      expect(wrapper.vm.deletablesProcessing).toEqual(false)
      expect(wrapper.vm.deletablesProgress).toEqual(0)
      expect(wrapper.vm.deletablesStatus).toEqual('')
      expect(wrapper.vm.deleteDialog).toEqual(false)
      expect(wrapper.vm.deletablesProcessing).toEqual(false)

      wrapper.vm.deletables = [FIXTURE_ACTIVITIES[0]]
      await wrapper.vm.deleteActivities()

      expect(wrapper.apiMocked.history.delete).toHaveLength(1)
      expect(wrapper.vm.deletablesProcessing).toEqual(false)
      expect(wrapper.vm.deletablesProgress).toEqual(0)
      expect(wrapper.vm.deletablesStatus).toEqual('0 / 1 Done')
      expect(wrapper.vm.deleteDialog).toEqual(false)
      expect(wrapper.vm.deletablesProcessing).toEqual(false)
    })
  })
})
