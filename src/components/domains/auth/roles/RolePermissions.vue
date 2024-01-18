<template>
  <select-multiple-permissions
    v-bind="$attrs"
    v-model="currentPermissions"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultiplePermissions from '@/components/common/selectables/SelectMultiplePermissions.vue'
import type { Permission, Role } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'RolePermissions',
  components: { SelectMultiplePermissions },
  props: {
    value: {
      type: Object as PropType<Role>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const currentPermissions = ref<Permission[]>(props.value.permissions || [])

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

    const permission_ids = computed({
      get: () => props.value.permission_ids || [],
      set: (permission_ids) => emit('input', { ...props.value, permission_ids })
    })

    const onSelect = (val: Permission[]) => {
      currentPermissions.value = val
      permission_ids.value = val.map((item) => item.id)
    }

    return {
      currentPermissions,
      gridOptions,
      onSelect
    }
  }
})
</script>
