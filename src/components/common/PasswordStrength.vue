<template>
  <div class="d-flex align-center flex-gap-16 flex-fill">
    <span :class="`${strengthIndicator.color}--text`">{{ $t(strengthIndicator.label) }}:</span>
    <v-progress-linear
      :value="strengthIndicator.length"
      :color="strengthIndicator.color"
      height="5"
      rounded
      buffer-value="100"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { passwordStrength } from 'check-password-strength'
import type { Options } from 'check-password-strength'

export default defineComponent({
  name: 'PasswordStrength',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const strengthOptions: Options<string> = [
      {
        id: 0,
        value: 'too weak',
        minDiversity: 0,
        minLength: 0
      },
      {
        id: 1,
        value: 'weak',
        minDiversity: 0,
        minLength: 8
      },
      {
        id: 2,
        value: 'medium',
        minDiversity: 2,
        minLength: 8
      },
      {
        id: 3,
        value: 'medium',
        minDiversity: 2,
        minLength: 10
      },
      {
        id: 4,
        value: 'strong',
        minDiversity: 4,
        minLength: 10
      },
      {
        id: 5,
        value: 'medium',
        minDiversity: 0,
        minLength: 15
      },
      {
        id: 6,
        value: 'strong',
        minDiversity: 3,
        minLength: 12
      },
      {
        id: 7,
        value: 'strong',
        minDiversity: 0,
        minLength: 18
      }
    ]

    const strengthIndicator = computed(() => {
      const passStrengths = passwordStrength(props.value, strengthOptions).value

      const strengths: Record<string, Record<'label' | 'color' | 'length', string>> = {
        weak: { label: 'Weak', color: 'red', length: '10' },
        medium: { label: 'Medium', color: 'orange', length: '50' },
        strong: { label: 'Strong', color: 'green', length: '100' }
      }

      return strengths[passStrengths] || strengths['weak']
    })

    return {
      strengthIndicator
    }
  }
})
</script>
