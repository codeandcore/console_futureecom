<template>
  <v-combobox
    v-bind="$attrs"
    v-model="region"
    :search-input.sync="searchRegion"
    :label="$t('Regions')"
    :items="regions"
    :loading="loading"
    item-text="name"
    outlined
    persistent-hint
    :disabled="!(regions || []).length"
    @blur="setRegion"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRegions } from '@/composable/repositories/useRegions'

export default defineComponent({
  name: 'RegionField',

  props: {
    value: {
      type: String,
      default: ''
    },
    countryCode: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const { regions, getRegions, loading } = useRegions()

    if (props.countryCode) {
      getRegions(props.countryCode)
        .then((val) => emit('update:has-regions', !!val.length))
        .catch(() => t('Unable to fetch regions'))
    }

    const region = computed({
      get: () => props.value,
      set: (val: string) => emit('input', val)
    })

    const searchRegion = ref(region.value || '')

    const setRegion = () => {
      if (!searchRegion.value) {
        searchRegion.value = ''
        region.value = ''
        return
      }

      const found = regions.value.find((r) => r.toLowerCase().startsWith(searchRegion.value.toLowerCase()))

      searchRegion.value = found || ''
      region.value = found || ''
    }

    return {
      regions,
      region,
      loading,
      searchRegion,
      setRegion
    }
  }
})
</script>
