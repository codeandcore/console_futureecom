<template>
  <select-multiple-roles
    v-bind="$attrs"
    v-model="currentRoles"
    :options="{ showChip: true, grid: gridOptions }"
    data-cy="client-input-roles"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleRoles from '@/components/common/selectables/SelectMultipleRoles.vue'
import type { Client, Role } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ClientRoles',

  components: { SelectMultipleRoles },

  props: {
    value: {
      type: Object as PropType<Pick<Client, 'roles' | 'role_ids'>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const currentRoles = ref<Role[]>(props.value.roles || [])

    const role_ids = computed({
      get: () => props.value.role_ids || [],
      set: (role_ids) => emit('input', { ...props.value, role_ids })
    })

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Store'), value: 'store' },
        { text: t('Action'), value: 'action' },
        { text: t('Resource'), value: 'resource' }
      ]

      return {
        headers
      }
    })

    const onSelect = (roles: Role[]) => {
      currentRoles.value = roles
      role_ids.value = roles.map((role) => role.id)
      emit('update:items', roles)
    }

    return {
      currentRoles,
      gridOptions,
      onSelect
    }
  }
})
</script>
