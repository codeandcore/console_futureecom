<template>
  <v-text-field v-bind="$attrs" v-model="name" :label="$t('Permission name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PermissionName',

  props: {
    value: {
      type: Object as PropType<Permission>,
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
