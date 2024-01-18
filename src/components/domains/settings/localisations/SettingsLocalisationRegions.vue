<template>
  <div class="">
    <h2>{{ $t('Regions') }}</h2>

    <settings-localisation-regions-ignore-requirements v-model="regions" />

    <span>
      {{ $t(' List of countries for which region requirement should be disabled and regions should be hidden.') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SettingsLocalisationRegionsIgnoreRequirements from '@/components/domains/settings/localisations/regions/SettingsLocalisationRegionsIgnoreRequirements.vue'
import type { LocalisationSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsLocalisationRegions',
  components: { SettingsLocalisationRegionsIgnoreRequirements },

  props: {
    value: {
      type: Object as PropType<LocalisationSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const regions = computed({
      get: () => props.value.regions,
      set: (regions) => emit('input', { ...props.value, regions })
    })

    return {
      regions
    }
  }
})
</script>
