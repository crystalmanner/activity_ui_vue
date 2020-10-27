<template>
  <v-container
    grid-list-md
    fluid
  >
    <v-flex xs12>
      <h2 class="f-page__title f-page__title--admin">
        {{ pageTitle }}
      </h2>
    </v-flex>
    <v-container
      grid-list-md
      fluid
    >
      <v-layout column>
        <v-flex>
          <f-activity-filter
            v-model="filter"
            :statuses="statuses"
            :types="types"
            @input="onFilter"
          />
        </v-flex>
        <v-flex>
          <f-list
            v-if="!isLoading"
            :items="activities"
            :statuses="statuses"
            :is-loading="isLoading || isLoadingList"
            :rows-per-page="pagination.rowsPerPage"
            :page="pagination.page"
            :total-items="pagination.totalItems"
            class="activities-list"
            @paginate="onPaginate"
            @change-status="onChangeStatus"
            @manage-view="onView"
            @manage-edit="onEdit"
            @manage-delete="onDelete"
            @manage-multiple-delete="onDeleteMultiple"
          />
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog
      v-model="deleteDialog"
      max-width="500"
    >
      <simple-confirm
        :class="{ 'deleting': deletablesProcessing }"
        :title="deleteDialogTitle"
        ok-label="Yes"
        cancel-label="No"
        @ok="deleteActivities"
        @cancel="deleteDialog = false"
      >
        <div class="py-5 px-2">
          <template v-if="deletablesProcessing">
            <div class="text-xs-center">
              <p class="subheading">
                Processing, please wait...
              </p>
              <v-progress-circular
                :rotate="-90"
                :size="200"
                :width="15"
                :value="deletablesProgress"
                color="primary"
              >
                {{ deletablesStatus }}
              </v-progress-circular>
            </div>
          </template>
          <template v-else>
            <p class="subheading">
              <span v-if="deletables.length < 2">Activity</span>
              <span v-else>Activities</span>
              : {{ deleteableNames }}
            </p>
          </template>
        </div>
      </simple-confirm>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import get from 'lodash/get'
import FList from '@freshinup/activity-ui/src/components/FList'
import FActivityFilter from '@freshinup/activity-ui/src/components/FActivityFilter'
import SimpleConfirm from '@freshinup/core-ui/src/components/FSimpleConfirm'
import { deletables } from '../../../components/mixins/Deletables'

export default {
  layout: 'admin-list',
  components: {
    FActivityFilter,
    FList,
    SimpleConfirm
  },
  mixins: [deletables],
  data () {
    return {
      pageTitle: 'Activity Worksheet',
      filter: {},
      deleteDialog: false,
      action: ''
    }
  },
  computed: {
    ...mapGetters('activities', {
      activities: 'items',
      pagination: 'pagination',
      sorting: 'sorting'
    }),
    ...mapState('activities', ['sortables']),
    ...mapGetters('page', ['isLoading']),
    ...mapGetters('statuses', { statuses: 'items' }),
    ...mapGetters('types', { types: 'items' }),
    isLoadingList () {
      return get(this.$store, 'state.activities.pending.items', true)
    },
    deleteDialogTitle () {
      return this.deletables.length < 2 ? 'Are you sure you want to delete this activity?' : 'Are you sure you want to delete the following activities?'
    },
    deleteableNames () {
      return this.deletables.map((activities) => {
        return activities.customer.name
      }).join(', ')
    }
  },
  methods: {
    onView (item) {
      this.$router.push({ path: '/admin/activities/' + item.uuid })
    },
    onEdit (item) {
      this.$router.push({ path: '/admin/activities/' + item.uuid + '/edit' })
    },
    onDelete (item) {
      this.deleteDialogUp(item)
    },
    async onChangeStatus (status, item) {
      await this.$store.dispatch('activities/patchItem', { data: { status }, params: { id: item.uuid } })
      this.filterActivities(this.filter)
    },
    onPaginate (value) {
      this.$store.dispatch('activities/setPagination', value)
      this.$store.dispatch('activities/getItems')
    },
    onDeleteMultiple (items) {
      this.deleteDialogUp(items)
    },
    deleteDialogUp (items) {
      if (!Array.isArray(items)) {
        items = [items]
      }
      this.deleteDialog = true
      this.deletables = items
    },
    async deleteActivities () {
      this.deletablesProcessing = true
      this.deletablesProgress = 0
      this.deletablesStatus = ''
      let dispatcheables = []
      this.deletables.forEach((activity) => {
        dispatcheables.push(this.$store.dispatch('activities/deleteItem', { getItems: false, params: { id: activity.uuid } }))
      })
      let chunks = this.chunk(dispatcheables, this.deletablesParrallelRequest)
      let doneCount = 0
      for (let i in chunks) {
        await Promise.all(chunks[i])
        doneCount += chunks[i].length
        this.deletablesStatus = doneCount + ' / ' + this.deletables.length + ' Done'
        this.deletablesProgress = doneCount / this.deletables.length * 100
        await this.sleep(this.deletablesSleepTime)
      }
      this.filterActivities(this.filter)
      await this.sleep(500)
      this.deleteDialog = false
      this.deletablesProcessing = false
    },
    filterActivities (params) {
      this.filter = params
      if (params.sort) {
        this.$store.dispatch('activities/setSort', params.sort)
      }
      this.$store.dispatch('activities/getItems')
    },
    onFilter (value) {
      this.$store.dispatch('activities/setFilters', value)
      this.$store.dispatch('activities/getItems')
    }
  },
  beforeRouteEnterOrUpdate (vm, to, from, next) {
    vm.$store.dispatch('page/setLoading', true)
    vm.$store.dispatch('activities/setSort', { sortBy: 'scheduled_at' })
    Promise.all([
      vm.$store.dispatch('activities/getItems'),
      vm.$store.dispatch('statuses/getItems'),
      vm.$store.dispatch('types/getItems')
    ]).then(() => {
      vm.$store.dispatch('page/setLoading', false)
      next && next()
    })
  }
}
</script>
