<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Shipping methods') }}</span>
          <div>
            <v-btn depressed text class="mx-4" @click="reindex">
              {{ $t('Reindex') }}
            </v-btn>
            <v-btn
              v-if="$canAny('manage,cart\\shipping', 'create,cart\\shipping')"
              data-cy="add-new-shipping-method"
              depressed
              color="primary"
              :to="{ name: 'shipping-method-create' }"
            >
              {{ $t('Add new shipping method') }}
            </v-btn>
          </div>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <resource-grid
          v-model="params"
          :options="options"
          :items="grid.data"
          hide-default-footer
          @onParamsChange="reloadCollection"
        >
          <template #item.name="{ item }">
            <router-link
              :is="canAccessShippingMethod ? 'router-link' : 'span'"
              :to="{ name: 'shipping-method-update', params: { id: item.id } }"
            >
              {{ item.name }}
            </router-link>
          </template>
          <template #item.enabled="{ item }">
            <v-icon>{{ item.enabled ? 'done' : 'close' }}</v-icon>
          </template>
          <template #item.price.amount="{ item }">
            <span>{{ $format.money.withStoreCurrency(item.price) }}</span>
          </template>
          <template #item.gross_price.amount="{ item }">
            <span>{{ $format.money.withStoreCurrency(item.gross_price) }}</span>
          </template>

          <template #item.created_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
          </template>
          <template #item.updated_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
          </template>

          <template #item.edit="{ item }">
            <button-action
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'shipping-method-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <shipping-method-action-delete icon :value="item" @onSuccess="onDeleteSuccess" />
          </template>
        </resource-grid>
        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { shippingMethodFilters } from '@/libs/domains/carts/shipping/filters'
import { useI18n } from 'vue-i18n-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import ShippingMethodActionDelete from '@/components/domains/shipping/ShippingMethods/actions/ShippingMethodActionDelete.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { ShippingFilter, ShippingGridRequest } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethods',

  components: {
    ButtonAction,
    TablePagination,
    Scrollable,

    ShippingMethodActionDelete,
    ResourceGrid,
    ScrollableResource
  },

  setup(props, { root }) {
    const { t } = useI18n()

    const { getStoreSetting } = useSettings()

    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()

    const params = computed<ShippingGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: ShippingGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.carts
        .shippings(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const reindex = () => {
      api.carts
        .reindexShipping()
        .then(() => reloadCollection(params.value))
        .catch(() => root.$toast.addWarningToast(root.$t('Unable to reindex shippings')))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Code'), value: 'code' },
        { text: ctx.$t('Enabled'), value: 'enabled' },
        { text: ctx.$t('Price Type'), value: 'price_type' },
        { text: ctx.$t('Price'), value: 'price.amount' }
      ]

      if (getStoreSetting('general.taxes.type') === 'vat') {
        headers.push({ text: ctx.$t('Gross Price'), value: 'gross_price.amount', sortable: false })
      }

      headers.push(
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      )

      if (canAccessShippingMethod.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition<ShippingFilter>[] = shippingMethodFilters.map((filter) => ({
        ...filter,
        label: t(filter.label)
      }))

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const canAccessShippingMethod = computed((ctx) => {
      return ctx.$canAny('manage,payments\\method', 'delete,payments\\method', 'update,payments\\method').value
    })

    const canDelete = computed((ctx) => {
      return ctx.$canAny('manage,payments\\method', 'delete,payments\\method').value
    })

    return {
      params,
      onDeleteSuccess,
      reloadCollection,
      options,
      grid,
      reindex,
      canAccessShippingMethod
    }
  }
})
</script>
