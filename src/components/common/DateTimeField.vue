<template>
  <div>
    <v-menu
      v-if="showDates"
      v-model="showDatePicker"
      :close-on-content-click="false"
      transition="scale-transition"
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          :value="currentDate"
          :label="$t('Date')"
          outlined
          class="me-4"
          v-bind="attrs"
          clearable
          @click:clear="deleteDate"
          v-on="on"
        />
      </template>
      <v-date-picker v-model="selectedDate" scrollable :allowed-dates="allowedDates">
        <div class="d-flex justify-space-between">
          <v-btn text color="primary" @click="cancelDate">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn text color="primary" @click="confirm">
            {{ $t('OK') }}
          </v-btn>
        </div>
      </v-date-picker>
    </v-menu>
    <v-menu
      v-if="showTimes"
      v-model="showTimePicker"
      :close-on-content-click="false"
      transition="scale-transition"
      :disabled="!currentDate"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          :value="currentTime"
          :label="$t('Time')"
          outlined
          class="ms-4"
          v-bind="attrs"
          clearable
          :disabled="!currentDate"
          @click:clear="deleteTime"
          v-on="on"
        />
      </template>
      <v-time-picker v-model="selectedTime" scrollable :allowed-dates="allowedTimes" format="24hr">
        <div class="d-flex justify-space-between">
          <v-btn text color="primary" @click="cancelTime">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn text color="primary" @click="confirm">
            {{ $t('OK') }}
          </v-btn>
        </div>
      </v-time-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useDate } from '@/composable/useDate'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'DateTimeField',

  props: {
    value: {
      type: String,
      default: ''
    },
    showDates: {
      type: Boolean,
      default: true
    },
    showTimes: {
      type: Boolean,
      default: true
    },
    allowedDates: {
      type: Array as () => PropType<string[]>,
      default: null
    },
    allowedTimes: {
      type: Array as () => PropType<string[]>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { getTime, getDate, formatDate } = useDate()

    const formatted = formatDate(props.value)
    const selectedDate = ref(getDate(formatted))
    const selectedTime = ref(getTime(formatted))

    const currentDate = computed(() => {
      const formatted = props.value ? formatDate(props.value) : ''
      return getDate(formatted)
    })
    const currentTime = computed(() => {
      if (!selectedTime.value || !props.value) {
        return ''
      }
      const formatted = props.value ? formatDate(props.value) : ''
      return getTime(formatted)
    })

    const showDatePicker = ref(false)
    const showTimePicker = ref(false)

    const confirm = (): void => {
      showDatePicker.value = false
      showTimePicker.value = false
      emitData()
    }

    const cancelDate = (): void => {
      showDatePicker.value = false
      selectedDate.value = ''
    }

    const cancelTime = (): void => {
      showTimePicker.value = false
      selectedTime.value = ''
    }

    const deleteDate = (): void => {
      cancelDate()
      emitData()
    }

    const deleteTime = (): void => {
      cancelTime()
      emitData()
    }

    const emitData = (): void => {
      if (!selectedDate.value) {
        selectedTime.value = ''
        emit('input', '')
        return
      }

      if (!selectedTime.value) {
        emit('input', `${selectedDate.value}`)
        return
      }

      emit('input', `${selectedDate.value} ${selectedTime.value}`.trim())
    }

    return {
      selectedDate,
      selectedTime,
      currentDate,
      currentTime,
      showDatePicker,
      showTimePicker,
      confirm,
      cancelDate,
      cancelTime,
      deleteDate,
      deleteTime
    }
  }
})
</script>
