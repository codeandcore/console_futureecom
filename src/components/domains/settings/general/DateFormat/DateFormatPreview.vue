<template>
  <div class="d-flex">
    <span class="grey--text">2020-12-12 13:00:00</span>
    <v-icon v-if="$vuetify.rtl" class="mx-3" small>arrow_backward</v-icon>
    <v-icon v-else class="mx-3" small>arrow_forward</v-icon>
    <span class="font-weight-medium">{{ formattedDateTime }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useTimezone } from '@/composable/useTimezone'
import type { DateTimeFormat } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'DateFormatPreview',

  props: {
    value: {
      type: Object as PropType<DateTimeFormat>,
      default: null
    }
  },

  setup(props) {
    const { getIntl } = useTimezone()

    const formattedDateTime = computed((): string => {
      if (!props.value) {
        return ''
      }

      const fmt = getIntl({
        timezone: 'UTC',
        time: props.value?.time || 'short',
        date: props.value?.date || 'short',
        calendar: props.value?.calendar || 'gregory'
      })

      return fmt?.format(Date.UTC(2020, 12, 12, 13, 0, 0)) || ''
    })

    return {
      formattedDateTime
    }
  }
})
</script>
