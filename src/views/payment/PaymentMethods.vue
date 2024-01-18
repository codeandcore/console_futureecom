<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Payment methods') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn
        v-if="canCreate"
        data-cy="add-new-payment-method"
        depressed
        color="primary"
        :to="{ name: 'payment-method-create' }"
      >
        {{ $t('Add new payment method') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'payment-method-update', params: { code: item.code } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.enabled="{ item }">
      <v-icon>{{ item.enabled ? 'done' : 'close' }}</v-icon>
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
        :to="{ name: 'payment-method-update', params: { code: item.code } }"
      />
    </template>
    <template #item.delete="{ item }">
      <payment-method-action-delete
        v-if="!PaymentMethodCodes.includes(item.code) && canDelete"
        :value="item"
        icon
        @success="onDeleteSuccess"
        @error="onRequestError"
      />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { PaymentMethodCodes } from '@/libs/domains/paymentMethods/codes'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import PaymentMethodActionDelete from '@/components/domains/payments/actions/PaymentMethodActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type {
  PaymentMethodFilter,
  PaymentMethodGridRequest
} from '@futureecom/futureecom-js/dist/services/payment-service'

export default defineComponent({
  name: 'PaymentMethods',

  components: { GridLayout, ButtonAction, PaymentMethodActionDelete },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('payments\\method')

    const params = useQueryFromUrl<PaymentMethodGridRequest>({ sort: ['-created_at'] })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status !== HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        reloadCollection()
      } else {
        addErrorToast(data.message)
      }
    }

    const reloadCollection = (gridParams?: PaymentMethodGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.payments
        .methods(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .catch((err) => onRequestError(err))
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Enabled'), value: 'enabled' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })

      const filters: FilterDefinition<PaymentMethodFilter>[] = [
        { type: 'text', code: 'name', label: t('Name') },
        { type: 'text', code: 'code', label: t('Code') },
        {
          type: 'select-multiple',
          code: 'provider',
          label: t('Provider'),
          options: [
            { text: t('Online'), value: 'online' },
            { text: t('Offline'), value: 'offline' }
          ]
        },
        { type: 'boolean', code: 'enabled', label: t('Enabled') },
        { type: 'date', code: 'created_at', label: t('Created at') },
        { type: 'date', code: 'updated_at', label: t('Created at') }
      ]

      return {
        headers,
        filters
      }
    })

    return {
      canCreate,
      canDelete,
      params,
      options,
      grid,
      PaymentMethodCodes,
      onDeleteSuccess,
      reloadCollection,
      onRequestError
    }
  }
})
</script>
