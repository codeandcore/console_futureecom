<template>
  <v-text-field
    v-model="form"
    v-bind="$attrs"
    :type="showPassword ? 'text' : 'password'"
    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
    outlined
    hide-details="auto"
    v-on="{ 'click:append': () => (showPassword = !showPassword), ...$listeners }"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'PasswordField',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const showPassword = ref(false)

    return {
      form,
      showPassword
    }
  }
})
</script>
