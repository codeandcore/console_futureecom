<template>
  <div class="d-flex flex-column">
    <span>{{ `${value.given_name} ${value.family_name}` }}</span>
    <span v-if="value.organization">{{ $t('Organisation') }}: {{ value.organization }}</span>

    <div class="d-flex flex-column my-4">
      <span>{{ value.address_line1 }}</span>
      <span>{{ value.locality }}, {{ value.administrative_area }}</span>
      <span>{{ $t('Postal Code') }}: {{ value.postal_code }}</span>
      <span>{{ getCountryName(value.country_code) }}</span>
    </div>

    <span v-if="value.telephone">{{ formatTelephone(value.telephone) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api/dist/vue-composition-api'
import { formatTelephone } from '@/libs/formatters/telephone'
import { useCountries } from '@/composable/repositories/useCountries'
import type { Address } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableAddressPreview',

  props: {
    value: {
      type: Object as PropType<Address>,
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
