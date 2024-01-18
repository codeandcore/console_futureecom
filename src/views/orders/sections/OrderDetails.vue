<template>
  <div class="d-flex flex-column">
    <h2 class="my-4">
      {{ $t('Customer') }}
    </h2>
    <div class="d-flex mb-4 align-start">
      <div class="d-flex flex-column col-6">
        <router-link
          :is="canAccessCustomer ? 'router-link' : 'span'"
          :to="{ name: 'customer-update', params: { id: value.customer.customer_id } }"
        >
          {{ value.customer.firstname }} {{ value.customer.lastname }}
        </router-link>
        <span v-if="value.customer.dob" class="text-caption">{{ $t('DOB') }}: {{ value.customer.dob }}</span>
      </div>
      <div class="d-flex flex-column col-6">
        <a :href="`mailto:${value.customer.email}`">{{ value.customer.email }}</a>
      </div>
    </div>
    <v-divider />
    <h2 class="my-4">
      {{ $t('Shipping Address') }}
    </h2>
    <order-details-address class="d-flex mb-4 align-start" :value="value.shipping_address" />

    <v-divider />
    <h2 class="my-4">
      {{ $t('Billing Address') }}
    </h2>
    <order-details-address class="d-flex mb-4 align-start" :value="value.billing_address" />

    <v-divider />
    <template v-if="value.note">
      <h2 class="my-4">
        {{ $t('Note') }}
      </h2>
      <span class="mb-8">{{ value.note }}</span>
      <v-divider />
    </template>
    <h2 class="my-4">
      {{ $t('Creation Source') }}
    </h2>
    <div class="d-flex flex-column col-6">
      <span>
        {{ $t('Created From') }}:
        <span class="font-weight-medium">{{ value.created_by.from }}</span>
      </span>
      <span class="mt-2">
        {{ $t('Created By') }}:
        <span class="font-weight-medium">{{ value.created_by.name }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import OrderDetailsAddress from '@/components/domains/orders/OrderDetailsAddress.vue'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderDetails',
  components: { OrderDetailsAddress },
  props: {
    value: {
      type: Object as () => Order,
      required: true
    }
  },

  setup() {
    const canAccessCustomer = computed((ctx) => {
      return ctx.$canAny('manage,customers\\customer', 'delete,customers\\customer', 'update,customers\\customer').value
    })

    return {
      canAccessCustomer
    }
  }
})
</script>
