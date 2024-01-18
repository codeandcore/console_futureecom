<template>
  <select-multiple-permissions
    v-bind="$attrs"
    v-model="currentPermissions"
    :options="{ showChip: true, grid: gridOptions, disabled: true }"
    data-cy="client-input-permissions"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultiplePermissions from '@/components/common/selectables/SelectMultiplePermissions.vue'
import type { Client, Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ClientPermissions',
  components: { SelectMultiplePermissions },

  props: {
    value: {
      type: Object as PropType<Pick<Client, 'permissions' | 'permission_ids'>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const currentPermissions = ref<Permission[]>(props.value.permissions || [])

    const permission_ids = computed({
      get: () => props.value.permission_ids || [],
      set: (permission_ids) => emit('input', { ...props.value, permission_ids })
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

    const onSelect = (permissions: Permission[]) => {
      currentPermissions.value = permissions
      permission_ids.value = permissions.map((permission) => permission.id)
      emit('update:items', permissions)
    }

    return {
      currentPermissions,
      onSelect,
      gridOptions
    }
  }
})
</script>
