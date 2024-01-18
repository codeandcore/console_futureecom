<template>
  <v-menu :close-on-content-click="false" offset-y min-width="auto">
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        :messages="messages"
        outlined
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" />
  </v-menu>
</template>

<script>
import { computed } from '@vue/composition-api'

export default {
  name: 'DatePicker',
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    messages: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const date = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      date
    }
  }
}
</script>
