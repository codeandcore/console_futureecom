<template>
  <v-select
    v-bind="$attrs"
    v-model="preset"
    :items="presetList"
    outlined
    :label="`${$t('Preset')}`"
    item-value="code"
    :item-text="(item) => `${item.name} (${item.code})`"
    :loading="loading"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Preset } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'CmsPresetSelect',

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const loading = ref(true)
    const presetList = ref<Preset[]>()

    const preset = computed({
      get: (): string => props.value,
      set: (val): void => emit('input', val)
    })

    useApi()
      .cms.presets({ perPage: -1 })
      .then((val) => {
        presetList.value = val.data
        preset.value = val.data.find((item) => item.code === props.value)?.code || val.data[0].code
      })
      .catch(() => {})
      .finally(() => (loading.value = false))

    return {
      presetList,
      loading,
      preset
    }
  }
})
</script>
