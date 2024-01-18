<template>
  <v-form v-bind="$attrs" ref="formRef" v-model="valid" lazy-validation @submit.prevent="submit">
    <slot :valid="valid" />
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import type { VForm } from '@/types/VForm'

/** @deprecated use v-form and @/composable/validator/useValidator instead **/
export default defineComponent({
  name: 'FormValidatorWrapper',

  props: {
    ignoreOnError: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const formRef = ref<VForm>()
    const valid = ref(false)

    const submit = async (): Promise<void> => {
      if (!formRef.value) {
        return
      }

      await formRef.value.validate()

      if (!props.ignoreOnError && !valid.value) {
        return
      }

      emit('submit')
    }

    return {
      valid,
      formRef,
      submit
    }
  }
})
</script>
