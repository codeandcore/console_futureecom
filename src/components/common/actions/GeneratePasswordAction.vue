<template>
  <v-btn v-bind="$attrs" depressed @click="$emit('input', generatePassword())">
    {{ $attrs.label || $t('Generate password') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import generator from 'generate-password'

export default defineComponent({
  name: 'GeneratePasswordAction',

  setup() {
    const generatePassword = () => {
      return generator.generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        strict: true
      })
    }

    return {
      generatePassword
    }
  }
})
</script>
