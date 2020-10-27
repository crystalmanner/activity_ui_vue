<template>
  <div>
    <data-table
      v-model="selected"
      :headers="headers"
      :items="itemsWithId"
      :rows-per-page-items="[5, 10, 15, 25, 30, 50]"
      :page="page"
      :rows-per-page="rowsPerPage"
      :loading="isLoading"
      :total-items="totalItems"
      :item-actions="itemActions"
      :multi-item-actions="selectedActions"
      item-key="uuid"
      hide-actions
      select-all
      @paginate="paginate"
      @manage="onManage"
      @manage-multiple="onManageMultiple"
    >
      <template v-slot:item-inner-status="{ item }">
        <f-btn-status
          v-model="multiStatus"
          :items="statuses"
          @input="onMultipleStatus"
        />
      </template>
      <template
        v-for="column in columns"
        :slot="'item-inner-' + column.value"
        slot-scope="prop"
      >
        <template v-if="column.readOnly">
          {{ prop.item[column.value] }}
        </template>
        <f-btn-status
          v-else-if="column.value === 'status_id'"
          :key="column.value"
          :value="`${prop.item.status.id}`"
          :items="statusesWithLabelColor"
          @input="changeStatus($event, prop.item)"
        />

        <div
          v-else-if="column.value === 'scheduled_at'"
          :key="column.value"
          class="activity-ui-admin-activity-list__scheduled_at"
        >
          {{ formatDate(prop.item.scheduled_at, 'MMM DD, YYYY H:M A') }}
        </div>

        <div
          v-else-if="column.value === 'customer_email'"
          :key="column.value"
        >
          <div> {{ prop.item.customer.name }} #{{ prop.item.customer.pbs_id }}</div>
          <div>
            {{ prop.item.customer.email }} {{ prop.item.mobile_phone }}
          </div>
        </div>

        <div
          v-else-if="column.value === 'type_name'"
          :key="column.value"
        >
          {{ prop.item.type.name }}
        </div>

        <div
          v-else-if="column.value === 'salesrep_email'"
          :key="column.value"
        >
          {{ prop.item.salesrep.name }}
        </div>

        <component
          :is="column.component"
          v-else-if="column.component"
          :key="column.value"
          :item="prop.item"
          @input="$emit(`on-${column.value}`, $event, prop.item)"
        />
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '@freshinup/core-ui/src/components/FDataTable'
import FBtnStatus from '@freshinup/core-ui/src/components/FBtnStatus'
import Pagination from '@freshinup/core-ui/src/mixins/Pagination'
import FormatDate from '@freshinup/core-ui/src/mixins/FormatDate'

export const DEFAULT_COLUMNS = [
  { text: 'Status', sortable: true, value: 'status_id', align: 'center' },
  { text: 'Date / Time', value: 'scheduled_at', sortable: true, align: 'left' },
  { text: 'Customer Info', sortable: true, value: 'customer_email', align: 'left' },
  { text: 'Activity Type', sortable: true, value: 'type_name', align: 'center' },
  { text: 'Sales rep', sortable: true, value: 'salesrep_email', align: 'center' },
  { text: 'Manage', sortable: false, value: 'manage', align: 'center' }
]
export const DEFAULT_ITEM_ACTIONS = [
  { action: 'edit', text: 'View / Edit' },
  { action: 'delete', text: 'Delete' }
]
export const DEFAULT_MULTI_ITEM_ACTIONS = [
  { action: 'delete', text: 'Delete' }
]

export default {
  components: {
    DataTable, FBtnStatus
  },
  mixins: [
    Pagination,
    FormatDate
  ],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    statuses: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => (DEFAULT_COLUMNS)
    },
    types: {
      type: Array,
      default: () => []
    },
    itemActions: {
      type: Array,
      default: () => (DEFAULT_ITEM_ACTIONS)
    },
    multiItemActions: {
      type: Array,
      default: () => (DEFAULT_MULTI_ITEM_ACTIONS)
    }
  },
  data () {
    return {
      selected: [],
      actionBtnTitle: 'Manage',
      multiStatus: '1'
    }
  },
  computed: {
    statusesWithLabelColor () {
      const withLabel = this.statuses.map(status => {
        return { id: status.id, label: status.name, color: this.colorOfStatus(status) }
      })
      return withLabel
    },
    itemsWithId () {
      const withId = this.items.map(item => {
        return { id: item.uuid, ...item }
      })
      return withId
    },
    headers () {
      let headers = [].concat(this.columns)
      if (this.selected.length > 1) {
        return headers.map(header => ({ ...header, sortable: false }))
      }
      return headers
    },
    selectedActions () {
      let actions = this.multiItemActions
      return actions
    }
  },
  methods: {
    colorOfStatus (status) {
      switch (status.id) {
        case 1:
          return 'success'
        case 2:
          return 'error'
        case 3:
          return 'warning'
        default:
          return 'success'
      }
    },
    paginate (value) {
      this.$emit('paginate', value)
    },
    onManage (action, item) {
      this.$emit('manage-' + action, item)
      this.$emit('manage', action, item)
    },
    onManageMultiple (action) {
      this.$emit('manage-multiple-' + action, this.selected)
      this.$emit('manage-multiple', action, this.selected)
    },
    changeStatus (value, item) {
      this.$emit('change-status', value, item)
    },
    onMultipleStatus (status) {
      this.$emit('manage-multiple-status', this.selected, status)
    }
  }
}

</script>

<style scoped lang="scss"></style>
