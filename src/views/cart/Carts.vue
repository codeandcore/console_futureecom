<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Carts') }}</span>
          <v-btn
            v-if="$canAny('manage,cart\\cart', 'create,cart\\cart')"
            data-cy="add-new-cart"
            depressed
            color="primary"
            :to="{ name: 'cart-create' }"
          >
            {{ $t('Create cart') }}
          </v-btn>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>
    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <cart-action-force-mass-delete-dialog
          v-if="errors"
          v-model="errors"
          :items="selected"
          @onSuccess="onMassDeleteSuccess"
        />
        <resource-grid
          v-model="params"
          selectable-key="number"
          :options="options"
          :items="grid.data"
          hide-default-footer
          :selected-items.sync="selected"
          :show-select="canDelete"
          @onParamsChange="reloadCollection"
        >
          <template #item.number="{ item }">
            <router-link
              :is="canAccessCart(item).value ? 'router-link' : 'span'"
              :to="{ name: 'cart-update', params: { id: item.id } }"
            >
              {{ getShortId(item) }}
            </router-link>
          </template>
          <template #item.name="{ item }">
            <router-link
              :is="canAccessCustomer && item.customer.customer_id ? 'router-link' : 'span'"
              :to="{
                name: 'customer-update',
                params: { id: item.customer.customer_id }
              }"
            >
              {{ getCustomerName(item).value }}
            </router-link>
          </template>
          <template #item.summary.total="{ item }">
            <span>{{ $format.money.withStoreCurrency(item.summary.total_due) }}</span>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
          </template>
          <template #item.edit="{ item }">
            <button-action
              v-if="canAccessCart(item).value"
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'cart-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <cart-action-delete :value="item" :disabled="grid.loading" icon @onSuccess="onDeleteSuccess" />
          </template>
        </resource-grid>

        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
          <div class="d-flex flex-gap-8">
            <cart-action-mass-delete
              v-if="canDelete"
              :items="selected"
              :disabled="grid.loading || !selected.length"
              @onSuccess="onMassDeleteSuccess"
              @onError="errors = $event"
            />
            <button-action
              :label="$t('Force delete')"
              :items="selected"
              text
              :disabled="grid.loading || !selected.length"
              @click="errors = { message: $t('Confirm force delete') }"
            />
          </div>
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>

    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
        <div class="d-flex flex-gap-8">
          <cart-action-mass-delete
            v-if="canDelete"
            :items="selected"
            :disabled="grid.loading || !selected.length"
            @onSuccess="onMassDeleteSuccess"
            @onError="errors = $event"
          />
          <button-action
            :label="$t('Force delete')"
            :items="selected"
            text
            :disabled="grid.loading || !selected.length"
            @click="errors = { message: $t('Confirm force delete') }"
          />
        </div>
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CartActionDelete from '@/components/domains/carts/actions/CartActionDelete.vue'
import CartActionForceMassDeleteDialog from '@/components/domains/carts/actions/CartActionForceMassDeleteDialog.vue'
import CartActionMassDelete from '@/components/domains/carts/actions/CartActionMassDelete.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { Cart, CartGridRequest } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid } from '@/types/Grids'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Carts',

  components: {
    CartActionForceMassDeleteDialog,
    ButtonAction,
    TablePagination,
    Scrollable,
    CartActionMassDelete,
    CartActionDelete,
    ResourceGrid,
    ScrollableResource
  },

  setup(props, { root }) {
    const errors = ref<MassDeleteError>()
    const grid = reactive<Grid>(gridTemplate())

    const selected = ref<Cart[]>([])
    const api = useApi()

    const params = computed<CartGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onMassDeleteSuccess = () => onDeleteSuccess(selected.value.length)

    const reloadCollection = (gridParams?: CartGridRequest, deletedCount = 0): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      setTimeout(() => {
        api.carts
          .carts(params.value)
          .then((value) => {
            grid.data = [...value.data]
            grid.meta = value.meta
            selected.value = []
          })
          .finally(() => (grid.loading = false))
      }, 1500 * deletedCount)
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Number'), value: 'number' },
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Item Count'), value: 'summary.total_items_count' },
        { text: ctx.$t('Total'), value: 'summary.total' },
        { text: ctx.$t('Created By'), value: 'created_at.name' },
        { text: ctx.$t('Created From'), value: 'created_by.from' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: '', value: 'edit', sortable: false, align: 'center', width: '0px' }
      ]

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'coupon', label: ctx.$t('Coupon') },
        { type: 'text', code: 'customer.firstname', label: ctx.$t('Customer first name') },
        { type: 'text', code: 'customer.lastname', label: ctx.$t('Customer last name') },
        { type: 'text', code: 'created_by.name', label: ctx.$t('Created by') },
        {
          type: 'select-multiple',
          code: 'created_by.from',
          label: ctx.$t('Created From'),
          options: [
            { text: ctx.$t('Storefront'), value: 'storefront' },
            { text: ctx.$t('Point of Sale'), value: 'pos' },
            { text: ctx.$t('Console'), value: 'console' },
            { text: ctx.$t('API'), value: 'api' }
          ]
        },
        { type: 'money-range', code: 'summary.total_due.amount', label: ctx.$t('Total due') },
        { type: 'date', code: 'created_at', label: ctx.$t('Created At') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const customerExists = (item: Cart) => {
      return Boolean(item.customer.firstname && item.customer.lastname && item.customer.email)
    }

    const getCustomerName = (item: Cart) => {
      return computed((ctx): string => {
        if (item.customer.firstname && item.customer.lastname) {
          return `${item.customer.firstname} ${item.customer.lastname}`
        }

        return ctx.$t('Guest')
      })
    }

    const getShortId = (item: Cart): string => item.id.split('-')[0]

    const canAccessCart = (item: Cart) =>
      computed((ctx) => {
        if (!customerExists(item)) {
          return false
        }
        return ctx.$canAny('manage,cart\\cart', 'delete,cart\\cart', 'update,cart\\cart').value
      })

    const canAccessCustomer = computed((ctx) => {
      return ctx.$canAny('manage,customers\\customer', 'delete,customers\\customer', 'update,customers\\customer').value
    })

    const canDelete = computed((ctx) => ctx.$canAny('manage,cart\\cart', 'delete,cart\\cart').value)

    return {
      params,
      errors,
      reloadCollection,
      options,
      getCustomerName,
      getShortId,
      grid,
      selected,
      canAccessCart,
      canAccessCustomer,
      onDeleteSuccess,
      onMassDeleteSuccess,
      canDelete
    }
  }
})
</script>
