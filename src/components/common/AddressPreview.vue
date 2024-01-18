<template>
  <div class="d-flex flex-column">
    <span>{{ `${value.given_name} ${value.family_name}` }}</span>
    <span>{{ `${value.address_line1}` }}</span>
    <span v-if="value.address_line2">{{ `${value.address_line2}` }}</span>

    <div class="d-flex align-center">
      <span>{{ `${countryName}, ${value.locality}, ${value.administrative_area} ${value.postal_code}` }}</span>

      <v-tooltip v-if="value.is_default" bottom class="">
        <template #activator="{ on, attrs }">
          <v-icon color="primary" v-bind="attrs" class="mx-3" v-on="on">star</v-icon>
        </template>
        <span>{{ $t('This is default address') }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FullAddressPreview',

  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },

  setup(props) {
    const { getCountryName } = useCountries()

    const countryName = computed(() => getCountryName(props.value.country_code))

    return {
      countryName
    }
  }
})
</script>
