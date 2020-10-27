import Component from '@/components/FList'
import { mount, shallowMount } from '@vue/test-utils'
import createLocalVue from 'vue-cli-plugin-freshinup-ui/utils/testing/createLocalVue'
import { FIXTURE_ACTIVITIES, FIXTURE_STATUSES } from 'tests/__data__/activities'
import DataTable from '@freshinup/core-ui/src/components/FDataTable'

describe(`List`, () => {
  describe('Visuals', () => {
    test('renders list', async () => {
      const wrapper = mount(Component, {
        localVue: createLocalVue().localVue,
        propsData: {
          items: FIXTURE_ACTIVITIES,
          statuses: FIXTURE_STATUSES
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.element).toMatchSnapshot()
    })
    test('passing columns', () => {
      const columns = [
        { text: 'Status', sortable: true, value: 'status', align: 'center' },
        { text: 'Date / Time', value: 'scheduled_at', sortable: true, align: 'left' },
        { text: 'Customer Info', sortable: true, value: 'customer', align: 'left' },
        { text: 'Activity Type', sortable: true, value: 'type', align: 'center' },
        { text: 'Sales rep', sortable: true, value: 'salesrep', align: 'center' },
        { text: 'Manage', sortable: false, value: 'manage', align: 'center' }
      ]

      const wrapper = mount(Component, {
        localVue: createLocalVue().localVue,
        propsData: {
          items: FIXTURE_ACTIVITIES,
          columns
        }
      })

      expect(wrapper.element).toMatchSnapshot()
      expect(wrapper.text()).toContain(FIXTURE_ACTIVITIES[0].customer.name)
    })
  })
  describe('Computed', () => {
    test('default prop of items is []', () => {
      const wrapper = shallowMount(Component, {})
      expect(wrapper.vm.items).toEqual([])
    })
    test('default prop of statuses is []', () => {
      const wrapper = shallowMount(Component, {})
      expect(wrapper.vm.statuses).toEqual([])
    })
    test('each item of props:items for statuses dropdown should include id, label, color', () => {
      const wrapper = mount(Component, {
        propsData: {
          statuses: FIXTURE_STATUSES
        }
      })
      const included = wrapper.vm.statusesWithLabelColor[0].hasOwnProperty(
        'label'
      )
      expect(included).toEqual(true)
    })
    test('selectedActions', () => {
      const wrapper = shallowMount(Component, {
        localVue: createLocalVue().localVue
      })

      const DEFAULT_MULTI_ITEM_ACTIONS = [
        { action: 'delete', text: 'Delete' }
      ]

      expect(wrapper.vm.selectedActions).toEqual(DEFAULT_MULTI_ITEM_ACTIONS)

      const newMultiActions = [{ action: 'some', text: 'Some' }, { action: 'thing', text: 'Thing' }]
      wrapper.setProps({
        multiItemActions: newMultiActions
      })
      expect(wrapper.vm.selectedActions).toEqual([
        ...newMultiActions
      ])
    })
    test('passing headers', () => {
      const columns = [
        { text: 'Status', sortable: true, value: 'status', align: 'center' },
        { text: 'Date / Time', value: 'scheduled_at', sortable: true, align: 'left' },
        { text: 'Customer Info', sortable: true, value: 'customer', align: 'left' },
        { text: 'Activity Type', sortable: true, value: 'type', align: 'center' },
        { text: 'Sales rep', sortable: true, value: 'salesrep', align: 'center' },
        { text: 'Manage', sortable: false, value: 'manage', align: 'center' }
      ]

      const wrapper = shallowMount(Component, {
        localVue: createLocalVue().localVue,
        propsData: {
          columns
        }
      })

      expect(wrapper.element).toMatchSnapshot()
      expect(wrapper.vm.headers).toEqual([
        ...columns
      ])

      wrapper.vm.selcted = FIXTURE_ACTIVITIES
      expect(wrapper.element).toMatchSnapshot()
    })
  })
  describe('pagination', () => {
    test('emits paginate event when the datatable', () => {
      const wrapper = shallowMount(Component, {
        localVue: createLocalVue().localVue
      })
      const pagination = {
        rowsPerPage: 5,
        page: 2,
        totalItems: 10
      }
      wrapper.find(DataTable).vm.$emit('paginate', pagination)
      expect(wrapper.emitted().paginate).toBeTruthy()
      expect(wrapper.emitted().paginate).toHaveLength(1)
      expect(wrapper.emitted().paginate[0][0]).toEqual(pagination)
    })
    test('occurs when onRowsPerPageChange is invoked', () => {
      const wrapper = shallowMount(Component, {
        localVue: createLocalVue().localVue
      })
      wrapper.vm.onRowsPerPageChange(2)
      wrapper.vm.onRowsPerPageChange(1)

      expect(wrapper.emitted().paginate).toBeTruthy()
      expect(wrapper.emitted().paginate).toHaveLength(2)

      expect(wrapper.emitted().paginate[0][0].rowsPerPage).toEqual(2)
      expect(wrapper.emitted().paginate[1][0].rowsPerPage).toEqual(1)
    })
    test('occurs when onPageChange is invoked', () => {
      const wrapper = shallowMount(Component, {
        localVue: createLocalVue().localVue
      })
      wrapper.vm.onPageChange(17)
      wrapper.vm.onPageChange(4)

      expect(wrapper.emitted().paginate).toBeTruthy()
      expect(wrapper.emitted().paginate).toHaveLength(2)

      expect(wrapper.emitted().paginate[0][0].page).toEqual(17)
      expect(wrapper.emitted().paginate[1][0].page).toEqual(4)
    })
  })
  describe('Methods', () => {
    test('color Of Status', () => {
      const wrapper = mount(Component, {})
      wrapper.setProps({
        statuses: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      })
      expect(wrapper.vm.statusesWithLabelColor[0].color).toEqual('success')
      expect(wrapper.vm.statusesWithLabelColor[1].color).toEqual('error')
      expect(wrapper.vm.statusesWithLabelColor[2].color).toEqual('warning')
      expect(wrapper.vm.statusesWithLabelColor[3].color).toEqual('success')
    })
    describe('onChangeStatus()', () => {
      test('events emitted', async () => {
        const wrapper = shallowMount(Component)
        const item = {}
        wrapper.vm.changeStatus(1, item)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['change-status']).toBeTruthy()
      })
    })
    describe('onManage()', () => {
      test('events emitted', async () => {
        const wrapper = shallowMount(Component)
        const item = {}
        wrapper.vm.onManage('edit', item)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['manage-edit']).toBeTruthy()
        wrapper.vm.onManage('delete', item)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['manage-delete']).toBeTruthy()
      })
    })
    describe('onManageMultiple()', () => {
      test('events emitted', async () => {
        const wrapper = shallowMount(Component)
        const item = {}
        wrapper.vm.onManageMultiple('edit', item)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['manage-multiple-edit']).toBeTruthy()
        wrapper.vm.onManageMultiple('delete', item)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['manage-multiple-delete']).toBeTruthy()
      })
    })
    describe('onMultipleStatus()', () => {
      test('events emitted', async () => {
        const wrapper = shallowMount(Component)
        wrapper.vm.onMultipleStatus(1)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['manage-multiple-status']).toBeTruthy()
      })
    })
  })
})
