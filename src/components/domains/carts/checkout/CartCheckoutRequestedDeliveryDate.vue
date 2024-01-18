<template>
  <v-menu
    v-model="showDatePicker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ attrs, on }">
      <v-text-field
        v-model="date"
        v-bind="{ ...$attrs, ...attrs }"
        :label="$t('Delivery date')"
        :class="{ required: dateIsRequired }"
        clearable
        readonly
        outlined
        prepend-icon="event"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="selectedDate" :allowed-dates="allowedDates" :min="min">
      <v-btn text @click="setDate('')">
        {{ $t('Clear') }}
      </v-btn>
      <v-spacer />
      <v-btn text color="primary" @click="setDate(selectedDate)">
        <span>{{ $t('Save') }}</span>
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useDate } from '@/composable/useDate'
import { useRequestedDelivery } from '@/composable/useOrderRequestedDelivery'

export default defineComponent({
  name: 'CartCheckoutRequestedDeliveryDate',

  inheritAttrs: false,

  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const showDatePicker = ref(false)

    const { getDate, getTime } = useDate()
    const time = computed(() => (props.value ? getTime(props.value) : ''))

    const date = computed({
      get: () => (props.value ? getDate(props.value) : ''),
      set: (date) => emit('input', date ? [date, time.value].join(' ').trim() : '')
    })

    const selectedDate = ref('')

    const { isToday, minDeliveryDate, excludedDates, excludedWeekdays } = useRequestedDelivery()

    const allowedDates = (value: string): boolean => {
      const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      if (isToday(value) && time.value) {
        const now = new Date()
        const [h, m] = time.value.split(':').map(Number)
        if (h <= now.getHours() && m <= now.getUTCMinutes()) {
          return false
        }
      }
      const day = WEEKDAYS[new Date(value).getUTCDay()]
      return !excludedDates().includes(value) && !excludedWeekdays().includes(day)
    }

    const setDate = (value: string) => {
      date.value = value
      showDatePicker.value = false
    }

    return {
      selectedDate,
      date,
      min: minDeliveryDate(time.value),
      dateIsRequired: Boolean(time.value || date.value),
      allowedDates,
      showDatePicker,
      setDate
    }
  }
})
</script>
