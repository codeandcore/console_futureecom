<template>
  <v-select
    v-model="time"
    outlined
    :items="items"
    item-text="text"
    item-value="value"
    :label="$t('Time Type')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { DateTimeFormat } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'DateFormatTimeType',
  props: {
    value: {
      type: Object as PropType<DateTimeFormat>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const time = computed({
      get: () => (props.value ? props.value.time : ''),
      set: (time) => emit('input', { ...props.value, time })
    })

    const items = computed(() => [
      { text: t('short'), value: 'short' },
      { text: t('medium'), value: 'medium' },
      { text: t('long'), value: 'long' },
      { text: t('full'), value: 'full' }
    ])

    return {
      time,
      items
    }
  }
})
</script>
