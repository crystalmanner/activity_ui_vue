import { mount, shallowMount } from '@vue/test-utils'
import createLocalVue from 'vue-cli-plugin-freshinup-ui/utils/testing/createLocalVue'
import Component, { DEFAULT_FILTER_VALUE } from './FActivityFilter'
import { defaultAndEmpty, allFilterOptions } from './FActivityFilter.stories'

const fullFilters = {
  term: 'John',
  status_id: [ 1 ],
  type_id: [ 1 ],
  sales_rep_uuid: [ 1 ],
  customer_uuid: [ 1 ],
  date_after: '2020-01-01',
  date_before: '2020-12-31'
}

describe('FActivityFilter', () => {
  const multiSimpleStub = { render () {}, methods: { resetTerm () {} } }

  describe('Computed', () => {
    let vm, wrapper
    beforeEach(() => {
      wrapper = shallowMount(Component, { propsData: { value: DEFAULT_FILTER_VALUE } })
      vm = wrapper.vm
    })
    test('empty Value', () => {
      expect(wrapper.props().value).toEqual(DEFAULT_FILTER_VALUE)
      expect(vm.value).toEqual(DEFAULT_FILTER_VALUE)
    })
    test('default props', () => {
      expect(vm.term).toBeDefined()
      expect(vm.range).toBeDefined()
      expect(vm.status).toBeDefined()
      expect(vm.sales_rep_uuid).toBeDefined()
      expect(vm.customer_uuid).toBeDefined()
    })
    test('search changes', () => {
      vm.term = 'fresh'
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload).toHaveProperty('term', 'fresh')
    })
    test('status changes', () => {
      vm.status = [ 1 ]
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload).toHaveProperty('status_id', [ 1 ])
    })
    test('type changes', () => {
      vm.type = [ 1 ]
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload).toHaveProperty('type_id', [ 1 ])
    })
    test('sale reps changes', () => {
      vm.sales_rep_uuid = [ 1 ]
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload).toHaveProperty('sales_rep_uuid', [ 1 ])
    })
    test('customer changes', () => {
      vm.customer_uuid = [ 1 ]
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload).toHaveProperty('customer_uuid', [ 1 ])
    })
    test('date changes', () => {
      vm.range = { start: '2020-01-01', end: '2020-12-31' }
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload).toHaveProperty('date_after', '2020-01-01')
      expect(payload).toHaveProperty('date_before', '2020-12-31')
    })
  })

  describe('Methods', () => {
    test('clear', () => {
      const wrapper = shallowMount(Component, {
        stubs: { 'MultiSimple': multiSimpleStub },
        propsData: { value: fullFilters }
      })
      wrapper.vm.clear()
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('clear')).toBeTruthy()
    })

    test('run', () => {
      const wrapper = shallowMount(Component)
      wrapper.vm.run({ term: 'fresh' })
      const [ payload ] = wrapper.emitted().input[0]
      expect(payload.term).toBe('fresh')
    })
  })

  describe('Visuals', () => {
    test('defaultAndEmpty', () => {
      // Use mount and snapshot assertions
      const wrapper = mount(defaultAndEmpty(), {
        localVue: createLocalVue().vue
      })

      expect(wrapper.isVueInstance()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })

    test('allFilterOptions', () => {
      // Use mount and snapshot assertions
      const wrapper = mount(allFilterOptions(), {
        localVue: createLocalVue().vue
      })

      expect(wrapper.isVueInstance()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
