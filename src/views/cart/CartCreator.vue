<template>
  <div class="d-flex flex-column align-center text-center mt-4">
    <div class="my-4 text-h5">
      <span>{{ $t('Create cart for...') }}</span>
    </div>
    <search-customer :options="{ showChip: false, grid: { headers } }">
      <template #item.firstname="{ item }">
        <router-link
          :is="canRead || canUpdate || canDelete ? 'router-link' : 'span'"
          :to="{ name: 'customer-update', params: { id: item.id } }"
        >
          {{ item.firstname }}
        </router-link>
      </template>
      <template #item.lastname="{ item }">
        <router-link
          :is="canRead || canUpdate || canDelete ? 'router-link' : 'span'"
          :to="{ name: 'customer-update', params: { id: item.id } }"
        >
          {{ item.lastname }}
        </router-link>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          fab
          depressed
          x-small
          color="primary"
          :loading="item === customer && loading"
          :disabled="item !== customer && loading"
          @click="onCustomerSelect(item)"
        >
          <rtl-chevron-icon />
        </v-btn>
      </template>
    </search-customer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import SearchCustomer from '@/components/common/selectables/SearchCustomer.vue'
import useApi from '@/composable/useApi'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CartCreator',

  components: { RtlChevronIcon, SearchCustomer },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { canRead, canUpdate, canDelete } = useCrudChecker('customers\\customer')

    const router = useRouter()

    const api = useApi()
    const customer = ref<Customer>()
    const loading = ref(false)

    const onCustomerSelect = (val: Customer) => {
      customer.value = val

      loading.value = true
      api.carts
        .createCart({ customer: { customer_id: val.id } })
        .then(({ id }) => {
          addSuccessToast(t(`Created cart for ${val.firstname} ${val.lastname}`))
          router.push({ name: 'cart-update', params: { id } })
        })
        .catch(() => addErrorToast(t('Unable to create cart')))
        .finally(() => (loading.value = false))
    }

    const headers = computed((): ResourceGridOptions['headers'] => [
      { text: t('Firstname'), value: 'firstname' },
      { text: t('Lastname'), value: 'lastname' },
      { text: t('Email'), value: 'email' },
      { text: '', value: 'actions', sortable: false, align: 'center' }
    ])

    return {
      customer,
      headers,
      loading,
      canRead,
      canUpdate,
      canDelete,
      onCustomerSelect
    }
  }
})
</script>
