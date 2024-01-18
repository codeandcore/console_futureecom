<template>
  <v-menu
    v-model="showPicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="$attrs"
        v-model="dob"
        :label="$t('Date of birth')"
        outlined
        readonly
        hide-details="auto"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="dob" @input="showPicker = false" />
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerDob',

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const showPicker = ref(false)

    const dob = computed({
      get: () => props.value.dob,
      set: (dob) => emit('input', { ...props.value, dob })
    })

    return {
      showPicker,
      dob
    }
  }
})
</script>
