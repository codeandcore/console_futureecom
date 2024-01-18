<template>
  <div>
    <date-format-time-type v-model="dateFormat" />
    <date-format-date-type v-model="dateFormat" />
    <date-format-calendar-type v-model="dateFormat" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import DateFormatCalendarType from '@/components/domains/settings/general/DateFormat/DateFormatCalendarType.vue'
import DateFormatDateType from '@/components/domains/settings/general/DateFormat/DateFormatDateType.vue'
import DateFormatTimeType from '@/components/domains/settings/general/DateFormat/DateFormatTimeType.vue'
import type { DateTimeFormat } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'DateFormatInputs',
  components: { DateFormatCalendarType, DateFormatDateType, DateFormatTimeType },
  props: {
    value: {
      type: Object as PropType<DateTimeFormat>,
      default: null
    }
  },

  setup(props, { emit }) {
    const dateFormat = computed({
      get: () => props.value,
      set: (dateFormat) => emit('input', dateFormat)
    })

    return {
      dateFormat
    }
  }
})
</script>
