<template>
  <v-combobox
    v-model="resource"
    :items="['*', ...resources]"
    :label="$t('Resource')"
    outlined
    v-bind="$attrs"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Abilities } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PermissionResource',

  props: {
    value: {
      type: Object as PropType<Permission>,
      required: true
    },
    abilities: {
      type: Object as PropType<Abilities>,
      required: true
    }
  },

  setup(props, { emit }) {
    const resource = computed({
      get: () => props.value.resource,
      set: (resource) => emit('input', { ...props.value, resource, action: '' })
    })

    const resources = computed(() => Object.keys(props.abilities.actions))

    return {
      resource,
      resources
    }
  }
})
</script>
