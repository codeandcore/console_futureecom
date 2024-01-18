<template>
  <v-combobox v-model="action" :items="actions" :label="$t('Action')" outlined v-bind="$attrs" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Abilities, AbilityResources } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PermissionAction',

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
    const action = computed({
      get: () => props.value.action,
      set: (action) => emit('input', { ...props.value, action })
    })

    const isResourceValid = (value: string): value is keyof AbilityResources => value in props.abilities.actions

    const actions = computed(() => {
      return isResourceValid(props.value.resource) ? ['*', ...props.abilities.actions[props.value.resource]] : ['*']
    })

    return {
      action,
      actions
    }
  }
})
</script>
