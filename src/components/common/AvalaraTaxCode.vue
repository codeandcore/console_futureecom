<template>
  <v-text-field v-model="avalaraTaxCode" v-bind="$attrs" :label="$t('Avalara Tax Code')" hide-details="auto" outlined />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AvalaraTaxCode',

  props: {
    value: {
      type: Object as PropType<{ [key: string]: unknown; avalara_tax_code?: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const avalaraTaxCode = computed({
      get: () => props.value.avalara_tax_code,
      set: (avalara_tax_code) => emit('input', { ...props.value, avalara_tax_code })
    })

    return {
      avalaraTaxCode
    }
  }
})
</script>
