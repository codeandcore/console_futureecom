<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title>{{ $t('Commissions') }}</v-card-title>
        <v-divider />
      </v-card>
    </template>
    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <resource-grid
          v-model="params"
          :options="options"
          show-select
          :items="grid.data"
          hide-default-footer
          :selected-items.sync="selected"
          @onParamsChange="reloadCollection"
        >
          <template #item.user_id="{ item }">
            <router-link small :to="{ name: 'admin-update', params: { id: item.user_id } }">
              {{ getShortId(item.user_id) }}
            </router-link>
          </template>
          <template #item.order_number="{ item }">
            <router-link small :to="{ name: 'single-order', params: { id: item.order_number } }">
              {{ item.order_number }}
            </router-link>
          </template>
          <template #item.percentage="{ item }">
            <div class="d-flex justify-center">
              <span>{{ item.percentage }}%</span>
            </div>
          </template>
          <template #item.commission_on_shipping="{ item }">
            <div class="d-flex justify-center">
              <v-icon>{{ item.commission_on_shipping ? 'check' : 'close' }}</v-icon>
            </div>
          </template>
          <template #item.commission_on_tax="{ item }">
            <div class="d-flex justify-center">
              <v-icon>{{ item.commission_on_tax ? 'check' : 'close' }}</v-icon>
            </div>
          </template>
          <template #item.approved="{ item }">
            <div class="d-flex justify-center">
              <v-icon>{{ item.approved ? 'check' : 'close' }}</v-icon>
            </div>
          </template>
          <template #item.amount="{ item }">
            <span v-if="item.amount">{{ $format.money.withStoreCurrency(item.amount) }}</span>
          </template>
          <template #item.revoked_amount="{ item }">
            <span v-if="item.revoked_amount">
              {{ $format.money.withStoreCurrency(item.revoked_amount) }}
            </span>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
          </template>
          <template #item.updated_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex flex-gap-8">
              <commission-action-approve
                v-if="canApproveItem(item).value"
                :value="item"
                :disabled="grid.loading"
                @onSuccess="reloadCollection"
              />
              <commission-action-unapprove
                v-else
                :value="item"
                :disabled="grid.loading"
                @onSuccess="reloadCollection"
              />
              <commission-action-revoke
                v-if="canRevokeItem(item).value"
                :value="item"
                :disabled="grid.loading"
                @onSuccess="reloadCollection"
              />
              <commission-action-recalculate
                v-if="canRecalculate"
                :value="item"
                :disabled="grid.loading"
                @onSuccess="reloadCollection"
              />
            </div>
          </template>
        </resource-grid>

        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
          <commission-mass-actions
            :dense="$vuetify.breakpoint.mdAndDown"
            :items="selected"
            :disabled="grid.loading || !selected.length"
            @onSuccess="reloadCollection"
          />
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
        <commission-mass-actions
          :dense="$vuetify.breakpoint.mdAndDown"
          :items="selected"
          :disabled="grid.loading || !selected.length"
          @onSuccess="reloadCollection"
        />
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate } from '@/libs/tables/grid'
import CommissionActionApprove from '@/components/domains/commission/actions/CommissionActionApprove.vue'
import CommissionActionRecalculate from '@/components/domains/commission/actions/CommissionActionRecalculate.vue'
import CommissionActionRevoke from '@/components/domains/commission/actions/CommissionActionRevoke.vue'
import CommissionActionUnapprove from '@/components/domains/commission/actions/CommissionActionUnapprove.vue'
import CommissionMassActions from '@/components/domains/commission/actions/CommissionMassActions.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import getShortId from '@/libs/getShortId'
import useApi from '@/composable/useApi'
import type { Commission, CommissionGridRequest } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Commissions',
  components: {
    CommissionMassActions,
    TablePagination,
    Scrollable,
    CommissionActionApprove,
    CommissionActionRecalculate,
    CommissionActionRevoke,
    CommissionActionUnapprove,
    ResourceGrid
  },

  setup(props, { root }) {
    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const selected = ref<Commission[]>([])

    const canApprove = computed((ctx) => ctx.$can('approve,commission\\commission').value)
    const canRevoke = computed((ctx) => ctx.$can('revoke,commission\\commission').value)
    const canRecalculate = computed((ctx) => ctx.$can('recalculate,commission\\commission').value)

    const canApproveItem = (item: Commission) => computed(() => !item.approved && canApprove.value)

    const canRevokeItem = (item: Commission) => {
      return computed(() => {
        if (!item.approved) {
          return false
        }
        if (item.revoked_amount) {
          return false
        }

        if (!['canceled', 'refunded'].includes(item.order_status)) {
          return false
        }

        return canRevoke.value
      })
    }

    const params = computed<CommissionGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const reloadCollection = (gridParams?: CommissionGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true
      setTimeout(() => {
        api.commissions
          .commissions(params.value)
          .then((value) => {
            grid.data = [...value.data]
            grid.meta = value.meta
            selected.value = []
          })
          .finally(() => (grid.loading = false))
      }, 1500 * selected.value.length)
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('User'), value: 'user_id', sortable: false },
        { text: ctx.$t('Order'), value: 'order_number', sortable: false },
        { text: ctx.$t('Percentage'), value: 'percentage', sortable: false },
        { text: ctx.$t('Commission on shipping'), value: 'commission_on_shipping', sortable: true },
        { text: ctx.$t('Commission on tax'), value: 'commission_on_tax', sortable: true },
        { text: ctx.$t('Amount'), value: 'amount' },
        { text: ctx.$t('Approved'), value: 'approved' },
        { text: ctx.$t('Revoked amount'), value: 'revoked_amount' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'customer_id', label: ctx.$t('Customer') },
        { type: 'boolean', code: 'approved', label: ctx.$t('Approved') },
        { type: 'text', code: 'order_number', label: ctx.$t('Order number') },
        { type: 'date', code: 'created_at', label: ctx.$t('Created at') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    return {
      canApproveItem,
      canRevokeItem,
      canRecalculate,
      grid,
      reloadCollection,
      selected,
      options,
      params,
      getShortId
    }
  }
})
</script>
