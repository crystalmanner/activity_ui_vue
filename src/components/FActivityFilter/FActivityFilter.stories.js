import axios from 'axios/index'
import MockAdapter from 'axios-mock-adapter'
import { MAIN } from 'activity-ui/storybook/categories'
import { action } from '@storybook/addon-actions'
import FActivityFilter from './FActivityFilter.vue'

import {
  FIXTURE_STATUSES,
  FIXTURE_TYPES,
  FIXTURE_CUSTOMERS,
  FIXTURE_SALEREPS
} from 'tests/__data__/activities'

const emptyFilters = {
  term: null,
  status: null,
  type: null,
  sales_rep_uuid: null,
  customer_uuid: null,
  date_after: null,
  date_before: null
}

const mock = new MockAdapter(axios.create())
mock.onGet('/api/v1/customers').reply(200, { data: FIXTURE_CUSTOMERS })
mock.onGet('/api/v1/sales-reps').reply(200, { data: FIXTURE_SALEREPS })

const baseComponentOptions = {
  components: { FActivityFilter },
  methods: {
    changed (params) {
      action('changed')(params)
    },
    clear () {
      action('clear')()
    }
  },
  data () {
    return {
      filters: emptyFilters,
      statuses: FIXTURE_STATUSES,
      types: FIXTURE_TYPES
    }
  }
}

export default {
  title: `${MAIN}|FActivityFilter`,
  id: 'FActivityFilter',
  decorators: [ () => `<v-container><v-layout><story /></v-layout></v-container>` ]
}

/**
 * https://storybook.js.org/docs/guides/guide-vue/#step-4-write-your-stories
 */
export const defaultAndEmpty = () => ({
  mixins: [ baseComponentOptions ],
  template: `
    <f-activity-filter
      v-model="filters"
      @clear="clear"
      @input="changed"
    />`
})

export const allFilterOptions = () => ({
  mixins: [ baseComponentOptions ],
  template: `
    <f-activity-filter
      v-model="filters"
      :statuses="statuses"
      :types="types"
      @clear="clear"
      @input="changed"
    />
  `
})

export const dateRangeSet = () => ({
  mixins: [ baseComponentOptions ],
  template: `
      <f-activity-filter
        v-model="filters"
        :statuses="statuses"
        :types="types"
        @clear="clear"
        @input="changed"
      />
  `
})
