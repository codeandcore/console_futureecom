<template>
  <select-multiple-permissions
    v-bind="$attrs"
    v-model="permissions"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultiplePermissions from '@/components/common/selectables/SelectMultiplePermissions.vue'
import type { Permission, User } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'UserPermissions',

  components: { SelectMultiplePermissions },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    },
    items: {
      type: Array as PropType<Permission[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const permissions = computed({
      get: () => props.items,
      set: (permissions: undefined | Permission[]) => emit('update:items', permissions)
    })

    const permission_ids = computed({
      get: () => props.value.permission_ids,
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

    const onSelect = (permissions: Permission[]) => (permission_ids.value = permissions.map(({ id }) => id))

    return {
      permissions,
      gridOptions,
      onSelect
    }
  }
})
</script>
