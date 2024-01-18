<template>
  <div>
    <v-slide-y-transition mode="out-in">
      <v-alert v-if="!(customer.groups || []).length" type="info">
        <div class="d-flex flex-column">
          <span>
            {{ $t('When no group is selected the default code will be applied') }}:
            <code class="font-weight-bold">{{ getStoreSetting('customers.customer.default_group') }}</code>
          </span>
          <span>
            {{ $t('You can change it in') }}
            <router-link
              :is="canReadSettings ? 'router-link' : 'span'"
              class="white--text text-decoration-underline"
              :to="{ name: 'settings', params: { option: 'customers' } }"
            >
              {{ $t(" customer's settings") }}
            </router-link>
          </span>
        </div>
      </v-alert>
    </v-slide-y-transition>

    <restricted v-if="!canReadCustomerGroups" />
    <customer-group v-else v-model="customer" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import CustomerGroup from '@/components/domains/customers/customer/CustomerGroup.vue'
import Restricted from '@/views/Restricted.vue'
import type { CustomerDetailsResponse } from '@futureecom/futureecom-js/dist/services/customer-service'

export default defineComponent({
  name: 'CustomerSingleGroups',
  components: { Restricted, CustomerGroup },

  props: {
    value: {
      type: Object as () => CustomerDetailsResponse,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const { getStoreSetting } = useSettings()

    const customer = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const canReadCustomerGroups = computed((ctx) => {
      return ctx.$canAny('read,customers\\group', 'manage,customers\\group').value
    })
    const canReadSettings = computed((ctx) => {
      return ctx.$canAny('update,settings\\customers', 'manage,settings\\customers').value
    })

    return {
      customer,
      getStoreSetting,
      canReadCustomerGroups,
      canReadSettings
    }
  }
})
</script>
