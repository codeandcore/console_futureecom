<template>
  <div>
    <div class="d-flex flex-column col-6">
      <span>{{ value.given_name }} {{ value.family_name }}</span>
      <span v-if="value.organization">{{ $t('Organisation') }}: {{ value.organization }}</span>
      <span v-if="value.telephone">{{ formatTelephone(value.telephone) }}</span>
    </div>
    <div class="d-flex flex-column col-6">
      <span>{{ value.address_line1 }}</span>
      <span>{{ value.locality }}, {{ value.administrative_area }}</span>
      <span>{{ $t('Postal Code') }}: {{ value.postal_code }}</span>
      <span>{{ getCountryName(value.country_code) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { formatTelephone } from '@/libs/formatters/telephone'
import { useCountries } from '@/composable/repositories/useCountries'
import type { OrderAddress } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderDetailsAddress',

  props: {
    value: {
      type: Object as () => OrderAddress,
      required: true
    }
  },

  setup() {
    return {
      formatTelephone,
      getCountryName: useCountries().getCountryName
    }
  }
})
</script>
