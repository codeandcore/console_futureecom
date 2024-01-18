<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="time"
    :label="$t('Delivery time')"
    :items="times"
    clearable
    outlined
    prepend-icon="schedule"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useDate } from '@/composable/useDate'
import { useRequestedDelivery } from '@/composable/useOrderRequestedDelivery'

export default defineComponent({
  name: 'CartCheckoutRequestedDeliveryTime',
  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const { getDate, getTime } = useDate()

    const time = computed({
      get: () => (props.value ? getTime(props.value) : ''),
      set: (time) => emit('input', date.value ? [date.value, time].join(' ').trim() : '')
    })

    const date = computed(() => (props.value ? getDate(props.value) : ''))

    const { availableTimes } = useRequestedDelivery()
    const times = computed(() => availableTimes(date.value))

    return {
      times,
      time
    }
  }
})
</script>
