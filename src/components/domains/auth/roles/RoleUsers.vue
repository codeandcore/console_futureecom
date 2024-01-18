<template>
  <select-multiple-admins
    v-bind="$attrs"
    v-model="currentUsers"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleAdmins from '@/components/common/selectables/SelectMultipleAdmins.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Role, User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'RolePermissions',
  components: { SelectMultipleAdmins },
  props: {
    value: {
      type: Object as PropType<Role>,
      required: true
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    const currentUsers = ref<User[]>(props.value.users || [])

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Email'), value: 'email' },
        { text: t('Name'), value: 'name' }
      ]

      return {
        headers
      }
    })

    const user_ids = computed({
      get: () => props.value.user_ids || [],
      set: (user_ids) => emit('input', { ...props.value, user_ids })
    })

    const onSelect = (val: User[]) => {
      currentUsers.value = val
      user_ids.value = val.map((item) => item.id)
    }

    return {
      currentUsers,
      gridOptions,
      onSelect
    }
  }
})
</script>
