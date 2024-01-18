<template>
  <resource-grid
    :options="commissionOptions"
    :items="commissions"
    class="ma-4 justify-center"
    @onParamsChange="reloadCollection"
  >
    <template #item.order_number="{ item }">
      <router-link small :to="{ name: 'single-order', params: { id: item.order_number } }">
        {{ item.order_number }}
      </router-link>
    </template>
    <template #item.percentage="{ item }">
      <div class="d-flex justify-center">{{ item.percentage }}%</div>
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
    <template #item.amount.amount="{ item }">
      <span v-if="item.amount">{{ $format.money.withStoreCurrency(item.amount) }}</span>
    </template>
    <template #item.revoked_amount="{ item }">
      <div v-if="item.revoked_amount" class="d-flex justify-center">
        {{ $format.money.withStoreCurrency(item.revoked_amount) }}
      </div>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
  </resource-grid>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import useApi from '@/composable/useApi'
import type { Commission, CommissionGridRequest } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { ResourceGridOptions } from '@/types/Grids'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'UserCommissions',
  components: { ResourceGrid },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const { addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)
    const commissionGrid = ref<ResponseCollection<Commission>>()
    const commissions = computed(() => (commissionGrid.value ? commissionGrid.value.data : []))

    const reloadCollection = (params: CommissionGridRequest): void => {
      loading.value = true

      api.commissions
        .commissions({
          ...params,
          filter: { user_id: props.id }
        })
        .then((response) => (commissionGrid.value = response))
        .catch(() => addErrorToast(t('Unable to load commissions')))
        .finally(() => (loading.value = false))
    }

    const commissionOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Order'), value: 'order_number', sortable: false },
        { text: t('Percentage'), value: 'percentage', sortable: false },
        { text: t('Commission on shipping'), value: 'commission_on_shipping', sortable: true },
        { text: t('Commission on tax'), value: 'commission_on_tax', sortable: true },
        { text: t('Amount'), value: 'amount.amount' },
        { text: t('Approved'), value: 'approved' },
        { text: t('Revoked amount'), value: 'revoked_amount' }
      ]

      return {
        headers,
        meta: commissionGrid.value?.meta,
        loading: loading.value
      }
    })

    return {
      commissionOptions,
      commissions,
      reloadCollection
    }
  }
})
</script>
