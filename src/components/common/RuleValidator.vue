<template>
  <v-slide-y-reverse-transition mode="out-in" group>
    <v-text-field key="hidden-input" :value="value" :rules="rules" outlined class="d-none" @update:error="setError">
      <template #message="{ message }">
        {{ catchErrors(message) }}
      </template>
    </v-text-field>
    <slot v-if="isError" :errors="errors">
      <div key="error-message" class="error--text text-caption">
        {{ errors }}
      </div>
    </slot>
  </v-slide-y-reverse-transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'

/** @deprecated use @/composable/useValidator instead **/
export default defineComponent({
  name: 'RuleValidator',

  props: {
    value: {
      required: true
    },
    rules: {
      type: Array as () => Function[],
      default: () => []
    }
  },

  setup(props, { emit }) {
    const isError = ref(false)
    const errors = ref<string[]>([])

    const catchErrors = (value: any): any => {
      errors.value = value
      isError.value = !!value
      emit('onError', errors.value)
      return errors.value
    }

    const setError = (val: boolean): void => {
      isError.value = val
    }

    watch(isError, () => {
      emit('hasError', isError.value)
    })

    return {
      isError,
      errors,
      catchErrors,
      setError
    }
  }
})
</script>
