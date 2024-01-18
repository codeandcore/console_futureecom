<template>
  <v-select
    v-bind="$attrs"
    v-model="parts"
    :items="partItems"
    :label="$t('Select parts')"
    outlined
    multiple
    hide-details="auto"
    clearable
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { CmsParts } from '@/types/Cms'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectMultipleCmsParts',

  props: {
    value: {
      type: Array as PropType<CmsParts[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const parts = computed({
      get: () => props.value,
      set: (parts) => emit('input', parts)
    })

    const partItems = computed(() => [
      { text: t('Pages'), value: 'pages' },
      { text: t('Blocks'), value: 'blocks' },
      { text: t('Settings'), value: 'settings' }
    ])

    return {
      parts,
      partItems
    }
  }
})
</script>
