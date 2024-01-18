<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Campaigns') }}</span>
          <div class="d-flex justify-end">
            <v-btn
              v-if="$canAny('manage,promotions\\promotion', 'create,promotions\\promotion')"
              data-cy="add-new-promotion"
              depressed
              color="primary"
              :to="{ name: 'campaign-create' }"
            >
              {{ $t('Add new campaign') }}
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
              :is="canAccessCoupon ? 'router-link' : 'span'"
              :to="{ name: 'campaign-update', params: { id: item.id } }"
            >
              {{ item.name }}
            </router-link>
          </template>
          <template #item.status="{ item }">
            <pre>{{ item.status }}</pre>
          </template>
          <template #item.edit="{ item }">
            <button-action
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'campaign-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <coupon-action-delete
              v-if="$canAny('manage,promotions\\promotion', 'delete,promotions\\promotion')"
              :value="item"
              icon
              @onSuccess="onDeleteSuccess"
            />
          </template>
        </resource-grid>
      </div>
      <v-divider />
      <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
        <table-pagination v-model="params" :meta="grid.meta" />
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
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CouponActionDelete from '@/components/domains/coupons/actions/CouponActionDelete.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PromotionGridRequest } from '@futureecom/futureecom-js/dist/services/promotion-service'

export default defineComponent({
  name: 'Coupons',

  components: {
    ButtonAction,
    CouponActionDelete,
    TablePagination,
    Scrollable,

    ResourceGrid,
    ScrollableResource
  },

  setup(props, { root }) {
    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const params = computed<PromotionGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: PromotionGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.promotions
        .promotions(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Type'), value: 'type' },
        { text: ctx.$t('Code'), value: 'code' },
        { text: ctx.$t('Start Date'), value: 'start_date' },
        { text: ctx.$t('End Date'), value: 'end_date' }
      ]

      if (canAccessCoupon.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'name', label: ctx.$t('Name') },
        { type: 'text', code: 'code', label: ctx.$t('Code') },
        { type: 'text', code: 'priority', label: ctx.$t('Priority') },
        {
          type: 'select-multiple',
          code: 'type',
          label: ctx.$t('Type'),
          options: [
            { text: ctx.$t('Coupon'), value: 'coupon' },
            { text: ctx.$t('Catalog'), value: 'catalog' }
          ]
        },
        { type: 'date', code: 'start_date', label: ctx.$t('Start date') },
        { type: 'date', code: 'end_date', label: ctx.$t('End date') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const canAccessCoupon = computed((ctx) => {
      return ctx.$canAny('manage,promotions\\promotion', 'delete,promotions\\promotion', 'update,promotions\\promotion')
        .value
    })

    const canDelete = computed((ctx) => {
      return ctx.$canAny('manage,promotions\\promotion', 'delete,promotions\\promotion').value
    })

    return {
      params,
      onDeleteSuccess,
      reloadCollection,
      options,
      grid,
      canAccessCoupon
    }
  }
})
</script>
