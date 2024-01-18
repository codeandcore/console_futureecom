<template>
  <v-alert type="error">
    <div v-for="(value, key) in stepErrors" :key="key">
      <div v-if="typeof value === 'string' && !!value">
        <span>{{ value }}</span>
      </div>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'OrderableCheckoutErrors',

  props: {
    value: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  emits: ['update:is-valid'],

  setup(props) {
    const stepErrors = computed(() => props.value || [])

    return {
      stepErrors
    }
  }
})
</script>
