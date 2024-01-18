<template>
  <div v-if="canRead" :key="addresses.length" class="justify-center">
    <subresource-expansion-panel :can-create="canCreate">
      <template #header>
        <span>{{ $t('Addresses') }}</span>
      </template>
      <template #content>
        <div :key="addresses.length">
          <customer-address-create :customer="value" hide-dividers @onCreated="onSubmit" />
        </div>
      </template>
    </subresource-expansion-panel>

    <v-data-table
      v-if="canRead"
      key="id"
      show-expand
      single-expand
      :items="addresses"
      :headers="headers"
      :hide-default-footer="addresses.length <= 10"
      class="v-data-table-shadowless"
    >
      <template #item.address="{ item }">
        <address-line :value="item" />
      </template>

      <template #expanded-item="{ headers: h, item }">
        <td :colspan="h.length" class="py-6">
          <v-card flat>
            <customer-address-update
              :key="`${item.id}-${item.is_default}`"
              :value="item"
              :customer="value"
              hide-dividers
              @onUpdated="onSubmit"
              @onDeleted="onDeleted"
            />
          </v-card>
        </td>
      </template>
    </v-data-table>
  </div>
  <div v-else class="justify-center">
    <restricted />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import AddressLine from '@/components/common/AddressLine.vue'
import CustomerAddressCreate from '@/views/customers/customer/CustomerAddressCreate.vue'
import CustomerAddressUpdate from '@/views/customers/customer/CustomerAddressUpdate.vue'
import Restricted from '@/views/Restricted.vue'
import SubresourceExpansionPanel from '@/components/tables/subresources/SubresourceExpansionPanel.vue'
import remapDefaultAddresses from '@/components/domains/customers/customer/helpers/remapDefaultAddresses'
import type { CustomerAddress, CustomerResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerAddress',
  components: {
    AddressLine,
    CustomerAddressUpdate,
    CustomerAddressCreate,
    SubresourceExpansionPanel,
    Restricted
  },

  props: {
    value: {
      type: Object as PropType<CustomerResponse>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const canRead = root.$canAny('manage,customers\\address', 'read,customers\\address')
    const canCreate = root.$canAny('manage,customers\\address', 'create,customers\\address')

    const addresses = computed({
      get: () => props.value.addresses || [],
      set: (addresses) => emit('input', { ...props.value, addresses })
    })

    const onSubmit = (value: CustomerAddress) => (addresses.value = remapDefaultAddresses(value, addresses.value))
    const onDeleted = (id: string) => (addresses.value = addresses.value.filter((address) => address.id !== id))

    const headers = computed(() => [
      { text: root.$t('Name'), value: 'given_name' },
      { text: root.$t('Lastname'), value: 'family_name' },
      { text: root.$t('Address'), value: 'address' },
      { text: root.$t('Actions'), value: 'data-table-expand' }
    ])

    return {
      canRead,
      canCreate,
      addresses,
      onSubmit,
      onDeleted,
      headers
    }
  }
})
</script>
