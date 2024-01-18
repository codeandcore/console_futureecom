<template>
  <v-select
    v-model="calendar"
    outlined
    :items="items"
    item-text="text"
    item-value="value"
    :label="$t('Calendar Type')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { DateTimeFormat } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'DateFormatCalendarType',
  props: {
    value: {
      type: Object as PropType<DateTimeFormat>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const calendar = computed({
      get: () => (props.value ? props.value.calendar : ''),
      set: (calendar) => emit('input', { ...props.value, calendar })
    })

    const items = computed(() => [
      { text: t('gregory'), value: 'gregory' },
      { text: t('buddhist'), value: 'buddhist' },
      { text: t('chinese'), value: 'chinese' },
      { text: t('coptic'), value: 'coptic' },
      { text: t('ethiopic'), value: 'ethiopic' },
      { text: t('hebrew'), value: 'hebrew' },
      { text: t('indian'), value: 'indian' },
      { text: t('islamic'), value: 'islamic' },
      { text: t('japanese'), value: 'japanese' },
      { text: t('persian'), value: 'persian' }
    ])

    return {
      calendar,
      items
    }
  }
})
</script>
