<template>
  <search-filter-sorter
    ref="filter"
    expanded
    without-filter-label
    v-bind="$attrs"
    v-on="$listeners"
    @run="run"
    @clear="clear"
  >
    <template v-slot:expanded>
      <v-card-text :class="$vuetify.breakpoint.smAndDown ? 'pl-0 pr-0' : 'pl-1 pr-1'">
        <v-container
          grid-list-md
          class="pr-0 pl-0"
        >
          <v-layout
            row
            wrap
            justify-space-between
          >
            <v-flex
              class="grow-evenly"
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xs}"
            >
              <v-layout
                row
                justify-space-between
                mb-2
              >
                <filter-label color="black">
                  Filter by date
                </filter-label>
                <clear-button
                  v-if="range.start || range.end"
                  @clear="range = null"
                />
              </v-layout>
              <date-time-picker
                v-model="range"
                class="data-time-picker no-border"
                only-date
                range
                no-clear-button
                format="YYYY-MM-DD"
                formatted="MM-DD-YYYY"
                input-size="lg"
                label="Select date"
                :color="$vuetify.theme.primary"
                :button-color="$vuetify.theme.primary"
              />
            </v-flex>
            <v-flex
              class="grow-evenly"
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xs}"
            >
              <v-layout
                row
                justify-space-between
                mb-2
              >
                <filter-label color="black">
                  Statuses
                </filter-label>
                <clear-button
                  v-if="status"
                  @clear="status = null"
                />
              </v-layout>
              <multi-select
                v-model="status"
                :items="statuses"
                item-value="id"
                item-text="name"
                placeholder="All Statuses"
                select-all-name="All Statuses"
                solo
                hide-details
              />
            </v-flex>
            <v-flex
              class="grow-evenly"
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xs}"
            >
              <v-layout
                row
                justify-space-between
                mb-2
              >
                <filter-label color="black">
                  Deal types
                </filter-label>
                <clear-button
                  v-if="type"
                  @clear="type = null"
                />
              </v-layout>
              <multi-select
                v-model="type"
                :items="types"
                item-value="id"
                item-text="name"
                placeholder="All Types"
                select-all-name="All Types"
                solo
                hide-details
              />
            </v-flex>
            <v-flex
              class="grow-evenly"
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xs}"
            >
              <v-layout
                row
                justify-space-between
                mb-2
              >
                <filter-label
                  color="black"
                >
                  Sales Reps
                </filter-label>
                <clear-button
                  v-if="sales_rep_uuid"
                  @clear="sales_rep_uuid = null"
                />
              </v-layout>
              <multi-simple
                ref="salesRep"
                v-model="sales_rep_uuid"
                :url="salesRepsUrl"
                term-param="filter[name]"
                placeholder="Search"
                background-color="white"
                class="mt-0 pt-0"
                height="48"
                not-clearable
                solo
              />
            </v-flex>
            <v-flex
              class="grow-evenly"
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xs}"
            >
              <v-layout
                row
                justify-space-between
                mb-2
              >
                <filter-label
                  color="black"
                >
                  Customer Name / ID
                </filter-label>
                <clear-button
                  v-if="customer_uuid"
                  @clear="customer_uuid = null"
                />
              </v-layout>
              <multi-simple
                ref="customer"
                v-model="customer_uuid"
                :url="customersUrl"
                term-param="filter[name]"
                placeholder="Search"
                background-color="white"
                class="mt-0 pt-0"
                height="48"
                not-clearable
                solo
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </template>
  </search-filter-sorter>
</template>

<script>
import SearchFilterSorter from '@freshinup/core-ui/src/components/FFilterSorter'
import ClearButton from '@freshinup/core-ui/src/components/FClearButton'
import MultiSimple from '@freshinup/core-ui/src/components/FMultiSimple'
import MultiSelect from '@freshinup/core-ui/src/components/FMultiSelect'
import FilterLabel from '@freshinup/core-ui/src/components/FFilterLabel'
import DateTimePicker from '@freshinup/core-ui/src/components/FDateRangePicker'

export const DEFAULT_FILTER_VALUE = {
  term: null,
  status_id: null,
  type_id: null,
  sales_rep_uuid: null,
  customer_uuid: null,
  date_after: null,
  date_before: null
}

export default {
  components: {
    DateTimePicker,
    SearchFilterSorter,
    MultiSimple,
    MultiSelect,
    ClearButton,
    FilterLabel
  },
  props: {
    value: {
      type: Object,
      default: () => (DEFAULT_FILTER_VALUE)
    },
    statuses: {
      type: Array,
      default: () => []
    },
    types: {
      type: Array,
      default: () => []
    },
    customersUrl: {
      type: String,
      default: 'api/v1/customers'
    },
    salesRepsUrl: {
      type: String,
      default: 'api/v1/sales-reps'
    }
  },
  computed: {
    term: {
      get () { return this.value && this.value.term },
      set (val) { this.emitValue({ term: val }) }
    },
    range: {
      get () {
        return {
          start: this.value && this.value.date_after,
          end: this.value && this.value.date_before
        }
      },
      set (val) {
        this.emitValue({
          date_after: (val && val.start),
          date_before: (val && val.end)
        })
      }
    },
    status: {
      get () { return this.value && this.value.status_id },
      set (val) { this.emitValue({ status_id: val }) }
    },
    type: {
      get () { return this.value && this.value.type_id },
      set (val) { this.emitValue({ type_id: val }) }
    },
    sales_rep_uuid: {
      get () { return this.value && this.value.sales_rep_uuid },
      set (val) { this.emitValue({ sales_rep_uuid: val }) }
    },
    customer_uuid: {
      get () { return this.value && this.value.customer_uuid },
      set (val) { this.emitValue({ customer_uuid: val }) }
    }
  },
  methods: {
    emitValue (val) {
      this.$emit('input', { ...this.value, ...val })
    },
    clear () {
      this.$refs.salesRep.resetTerm()
      this.$refs.customer.resetTerm()
      this.emitValue(DEFAULT_FILTER_VALUE)
      this.$emit('clear')
    },
    run ({ term }) {
      this.emitValue({ term })
    }
  }
}
</script>

<style>
.data-time-picker.no-border input.field-input {
  border: none !important;
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2),
              0px 2px 2px 0px rgba(0,0,0,0.14),
              0px 1px 5px 0px rgba(0,0,0,0.12);
}
.grow-evenly {
  flex-grow: 1 !important;
  flex-basis: 0 !important;
}
</style>
