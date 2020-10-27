import { action } from '@storybook/addon-actions'
import { MAIN } from 'activity-ui/storybook/categories'
import { FIXTURE_ACTIVITIES, FIXTURE_STATUSES } from 'tests/__data__/activities'
import FList from './FList'

export default {
  title: `${MAIN}|FList`,
  id: 'FList'
}

/**
 * https://storybook.js.org/docs/guides/guide-vue/#step-4-write-your-stories
 */
export const EmptyListStory = () => ({
  components: { FList },
  template: `
    <v-container>
      <f-list
        :items="[]"
        :statuses="statuses"
        />
    </v-container>
  `
})

export const ItemsInListStory = () => ({
  components: { FList },
  data () {
    return {
      items: FIXTURE_ACTIVITIES,
      statuses: FIXTURE_STATUSES
    }
  },
  methods: {
    onEdit (item) {
      action('edit')(item)
    },
    onDelete (item) {
      action('delete')(item)
    },
    onChangeStatus (status, item) {
      action('changeStatus')(status, item)
    }
  },
  template: `
    <v-container>
      <f-list
        :items="items"
        :statuses="statuses"
        @edit="onEdit"
        @delete="onDelete"
        @changeStatus="onChangeStatus"
      />
    </v-container>
`
})
