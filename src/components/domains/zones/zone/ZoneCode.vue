<template>
  <v-text-field v-bind="$attrs" v-model="code" :label="$t('Code')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'ZoneCode',

  props: {
    value: {
      type: Object as PropType<Zone>,
      required: true
    }
  },
  setup(props, { emit }) {
    const code = computed({
      get: () => props.value.code,
      set: (code) => emit('input', { ...props.value, code })
    })

    return {
      code
    }
  }
})
</script>
