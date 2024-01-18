<template>
  <v-expansion-panels flat :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header class="text-h6">
        {{ $t('Customer') }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="d-flex flex-column">
          <router-link
            v-if="value.customer.customer_id"
            :to="{
              name: 'customer-update',
              params: { id: value.customer.customer_id }
            }"
          >
            {{ `${value.customer.firstname} ${value.customer.lastname}` }}
          </router-link>
          <span v-else>
            {{ `${value.customer.firstname} ${value.customer.lastname}` }}
          </span>

          <span class="mt-2">{{ value.customer.email }}</span>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewCustomer',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  }
})
</script>
