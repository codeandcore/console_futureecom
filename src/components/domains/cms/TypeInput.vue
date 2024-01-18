<template>
  <v-select
    v-bind="$attrs"
    v-model="type"
    :items="types"
    :label="$t('Type')"
    outlined
    item-text="text"
    item-value="value"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'TypeInput',

  props: {
    value: {
      type: Object as PropType<{ type?: string; content?: '' }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const type = computed({
      get: () => props.value.type,
      set: (type) => emit('input', { ...props.value, type, content: '' })
    })

    const types = computed(() => [
      { text: t('Raw HTML'), value: 'raw_html' },
      { text: t('JSON'), value: 'json' }
    ])

    return {
      type,
      types
    }
  }
})
</script>
