<template>
  <select-multiple-roles
    v-bind="$attrs"
    v-model="roles"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleRoles from '@/components/common/selectables/SelectMultipleRoles.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Role, User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserRoles',

  components: { SelectMultipleRoles },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    },
    items: {
      type: Array as PropType<Role[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const roles = computed({
      get: () => props.items,
      set: (roles: undefined | Role[]) => emit('update:items', roles)
    })

    const role_ids = computed({
      get: () => props.value.role_ids,
      set: (role_ids) => emit('input', { ...props.value, role_ids })
    })

    const onSelect = (roles: Role[]) => (role_ids.value = roles.map(({ id }) => id))

    const gridOptions = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [{ text: t('Name'), value: 'name' }]

      return {
        headers
      }
    })

    return {
      roles,
      gridOptions,
      onSelect
    }
  }
})
</script>
