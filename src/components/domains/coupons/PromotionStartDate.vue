<template>
  <date-time-field :value="start_date || ''" @input="start_date = $event || null" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import DateTimeField from '@/components/common/DateTimeField.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionStartDate',
  components: { DateTimeField },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const start_date = computed({
      get: () => props.value.start_date,
      set: (start_date) => emit('input', { ...props.value, start_date })
    })

    return {
      start_date
    }
  }
})
</script>
