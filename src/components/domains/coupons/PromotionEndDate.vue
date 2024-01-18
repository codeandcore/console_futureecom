<template>
  <date-time-field :value="end_date || ''" @input="end_date = $event || null" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import DateTimeField from '@/components/common/DateTimeField.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionEndDate',
  components: { DateTimeField },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const end_date = computed({
      get: () => props.value.end_date,
      set: (end_date) => emit('input', { ...props.value, end_date })
    })

    return {
      end_date
    }
  }
})
</script>
