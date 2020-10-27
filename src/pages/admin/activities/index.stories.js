import Vue from 'vue'
import axios from 'axios'
import mockApi from 'vue-cli-plugin-freshinup-ui/utils/mockApi'
import makePageStory from 'vue-cli-plugin-freshinup-ui/utils/makePageStory'
import createStore from 'tests/createStore'
import { MAIN } from 'activity-ui/storybook/categories'
import Page from './index.vue'
import {
  FIXTURE_STATUSES,
  FIXTURE_TYPES,
  FIXTURE_CUSTOMERS,
  FIXTURE_SALEREPS,
  FIXTURE_ACTIVITIES
} from 'tests/__data__/activities'
import slice from 'lodash/slice' // dense array unlike Array#slice

import Provider from '@freshinup/activity-ui/src/Provider'
import CoreProvider from '@freshinup/core-ui/src/Provider'
import PageStoryInstances from 'tests/PageStoryInstances'

export default {
  title: `${MAIN} Pages|admin/activities`,
  id: 'pages/activities'
}

const apiMocked = mockApi({ axios })

export const PopulatedList5Items = () => {
  const store = createStore({})
  return makePageStory(Page, store, {
    Vue,
    providers: [CoreProvider(), Provider()],
    apiMocked,
    apiMockRoutes: [
      {
        path: /^\/?api\/activity\/v1\/statuses\/?/,
        GET: [200, { data: FIXTURE_STATUSES }]
      },
      {
        path: /^\/?api\/activity\/v1\/types\/?/,
        GET: [200, { data: FIXTURE_TYPES }]
      },
      {
        path: 'api/activity/v1/types?page[size]=10&page[number]=1',
        GET: [200, { data: FIXTURE_TYPES }]
      },
      {
        path: /^\/?api\/v1\/customers\/?/,
        GET: [200, { data: FIXTURE_CUSTOMERS }]
      },
      {
        path: /^\/?api\/v1\/sales-reps\/?/,
        GET: [200, { data: FIXTURE_SALEREPS }]
      },
      {
        path: /^\/?api\/activity\/v1\/activities\/?/,
        GET: [200, { data: slice(FIXTURE_ACTIVITIES, 0, 5) }]
      }
    ],
    beforeMount () {
      Page.beforeRouteEnterOrUpdate(this)
    }
  })
}

export const PopulatedListFullItems = () => {
  const store = createStore({})
  return makePageStory(Page, store, {
    Vue,
    providers: [CoreProvider(), Provider()],
    apiMocked,
    apiMockRoutes: [
      {
        path: /^\/?api\/activity\/v1\/statuses\/?/,
        GET: [200, { data: FIXTURE_STATUSES }]
      },
      {
        path: /^\/?api\/activity\/v1\/types\/?/,
        GET: [200, { data: FIXTURE_TYPES }]
      },
      {
        path: 'api/activity/v1/types?page[size]=10&page[number]=1',
        GET: [200, { data: FIXTURE_TYPES }]
      },
      {
        path: /^\/?api\/v1\/customers\/?/,
        GET: [200, { data: FIXTURE_CUSTOMERS }]
      },
      {
        path: /^\/?api\/v1\/sales-reps\/?/,
        GET: [200, { data: FIXTURE_SALEREPS }]
      },
      {
        path: /^\/?api\/activity\/v1\/activities\/?/,
        GET: [200, { data: FIXTURE_ACTIVITIES }]
      }
    ],
    beforeMount () {
      Page.beforeRouteEnterOrUpdate(this)
    }
  })
}

export const PageLoading = () => {
  const store = createStore({
    page: {
      isLoading: true
    }
  })
  return makePageStory(Page, store, {
    ...PageStoryInstances,
    apiMockRoutes: [
      {
        path: /^\/?api\/activity\/v1\/statuses\/?/,
        GET: [200, { data: FIXTURE_STATUSES }]
      },
      {
        path: /^\/?api\/activity\/v1\/types\/?/,
        GET: [200, { data: FIXTURE_TYPES }]
      },
      {
        path: 'api/activity/v1/types?page[size]=10&page[number]=1',
        GET: [200, { data: FIXTURE_TYPES }]
      },
      {
        path: /^\/?api\/v1\/customers\/?/,
        GET: [200, { data: FIXTURE_CUSTOMERS }]
      },
      {
        path: /^\/?api\/v1\/sales-reps\/?/,
        GET: [200, { data: FIXTURE_SALEREPS }]
      },
      {
        path: /^\/?api\/activity\/v1\/activities\/?/,
        GET: [200, { data: FIXTURE_ACTIVITIES }]
      }
    ],
    beforeMount () {
    }
  })
}
