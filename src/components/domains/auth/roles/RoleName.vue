<template>
  <v-text-field v-model="name" :label="$t('Name')" outlined v-bind="$attrs" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Role } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'RoleName',
  props: {
    value: {
      type: Object as PropType<Role>,
      required: true
    }
  },
  setup(props, { emit }) {
    const name = computed({
      get: () => props.value.name,
      set: (name) => emit('input', { ...props.value, name })
    })

    return {
      name
    }
  }
})
</script>
