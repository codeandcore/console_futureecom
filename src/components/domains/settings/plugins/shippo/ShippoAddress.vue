<template>
  <div>
    <shippo-address-name v-model="optionalAddress" />
    <shippo-address-street v-model="optionalAddress" />
    <shippo-address-country v-model="optionalAddress" />
    <shippo-address-region v-model="optionalAddress" />
    <shippo-address-city v-model="optionalAddress" />
    <shippo-address-postcode v-model="optionalAddress" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ShippoAddressCity from '@/components/domains/settings/plugins/shippo/address/ShippoAddressCity.vue'
import ShippoAddressCountry from '@/components/domains/settings/plugins/shippo/address/ShippoAddressCountry.vue'
import ShippoAddressName from '@/components/domains/settings/plugins/shippo/address/ShippoAddressName.vue'
import ShippoAddressPostcode from '@/components/domains/settings/plugins/shippo/address/ShippoAddressPostcode.vue'
import ShippoAddressRegion from '@/components/domains/settings/plugins/shippo/address/ShippoAddressRegion.vue'
import ShippoAddressStreet from '@/components/domains/settings/plugins/shippo/address/ShippoAddressStreet.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddress',

  components: {
    ShippoAddressPostcode,
    ShippoAddressCity,
    ShippoAddressRegion,
    ShippoAddressCountry,
    ShippoAddressStreet,
    ShippoAddressName
  },

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const optionalAddress = computed({
      get: () => props.value.optional_address,
      set: (optional_address) => emit('input', { ...props.value, optional_address })
    })

    return {
      optionalAddress
    }
  }
})
</script>
