<template>
  <div class="d-flex flex-column flex-gap-16">
    <shippo-enabled v-model="shippo" />
    <shippo-api-key v-model="shippo" />
    <shippo-live-rate v-model="shippo" />

    <v-divider class="my-4" />

    <div class="d-flex flex-column flex-gap-16">
      <span class="text-h6">{{ $t('Dimensions') }}</span>
      <shippo-dimensions v-model="shippo" class="d-flex flex-column flex-gap-16" />
    </div>

    <v-divider class="my-4" />

    <div class="d-flex flex-column flex-gap-16">
      <span class="text-h6">{{ $t('Fee') }}</span>
      <shippo-fee v-model="shippo" class="d-flex flex-gap-16" />
    </div>

    <v-divider class="my-4" />

    <div class="d-flex flex-column flex-gap-16">
      <span class="text-h6">{{ $t('Address') }} ({{ $t('Optional') }})</span>
      <shippo-address v-model="shippo" class="d-flex flex-column flex-gap-16" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ShippoAddress from '@/components/domains/settings/plugins/shippo/ShippoAddress.vue'
import ShippoApiKey from '@/components/domains/settings/plugins/shippo/ShippoApiKey.vue'
import ShippoDimensions from '@/components/domains/settings/plugins/shippo/ShippoDimensions.vue'
import ShippoEnabled from '@/components/domains/settings/plugins/shippo/ShippoEnabled.vue'
import ShippoFee from '@/components/domains/settings/plugins/shippo/ShippoFee.vue'
import ShippoLiveRate from '@/components/domains/settings/plugins/shippo/ShippoLiveRate.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'PluginSettingsShippo',

  components: { ShippoLiveRate, ShippoAddress, ShippoFee, ShippoDimensions, ShippoApiKey, ShippoEnabled },

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const shippo = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      shippo
    }
  }
})
</script>
