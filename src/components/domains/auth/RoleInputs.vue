<template>
  <div>
    <role-name v-model="role" :error-messages="errors['name']" class="required" />
    <div class="d-flex flex-column flex-gap-16">
      <div
        class="d-flex flex-column required"
        :class="{
          'grey--text': !canReadPermissions,
          'error--text': Object.keys(chipErrors('permission_ids').value).length
        }"
      >
        <no-permissions-tooltip v-if="!canReadUsers" />
        <label>{{ $t('Permissions') }}:</label>
        <span v-if="errors['permission_ids']" class="text-caption error--text">
          {{ $t('Required at least one') }} {{ $t('permission') }}
        </span>
      </div>

      <role-permissions v-if="canReadPermissions" v-model="role" :errors="chipErrors('permission_ids').value" />
      <deletable-chips v-else :value="role.permissions || []" :show-delete-icon="false">
        <template #default="{ item }">
          {{ item.name }}
        </template>
      </deletable-chips>
    </div>

    <div class="d-flex flex-column flex-gap-16">
      <div
        class="d-flex flex-column"
        :class="{ 'grey--text': !canReadUsers, 'error--text': Object.keys(chipErrors('user_ids').value).length }"
      >
        <no-permissions-tooltip v-if="!canReadUsers" />
        <label>{{ $t('Admins') }}:</label>
      </div>

      <role-users v-if="canReadUsers" v-model="role" :errors="chipErrors('user_ids').value" />
      <deletable-chips v-else :value="role.users || []" :show-delete-icon="false" />
    </div>

    <div class="d-flex flex-column flex-gap-16">
      <div
        class="d-flex flex-gap-16"
        :class="{
          'grey--text': !canReadClients,
          'error--text': Object.keys(chipErrors('client_ids').value).length
        }"
      >
        <no-permissions-tooltip v-if="!canReadClients" />
        <label>{{ $t('Clients') }}:</label>
      </div>
      <role-clients v-if="canReadClients" v-model="role" :errors="chipErrors('client_ids').value" />
      <deletable-chips v-else :value="role.clients || []" :show-delete-icon="false" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useCrudChecker } from '@/composable/useCrudChecker'
import DeletableChips from '@/components/common/DeletableChips.vue'
import NoPermissionsTooltip from '@/components/common/NoPermissionsTooltip.vue'
import RoleClients from '@/components/domains/auth/roles/RoleClients.vue'
import RoleName from '@/components/domains/auth/roles/RoleName.vue'
import RolePermissions from '@/components/domains/auth/roles/RolePermissions.vue'
import RoleUsers from '@/components/domains/auth/roles/RoleUsers.vue'
import type { PropType } from '@vue/composition-api'
import type { Role } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'RoleInputs',

  components: {
    DeletableChips,
    NoPermissionsTooltip,
    RoleClients,
    RolePermissions,
    RoleUsers,
    RoleName
  },

  props: {
    value: {
      type: Object as PropType<Role>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const role = computed({
      get: (): Role => props.value,
      set: (val) => emit('input', val)
    })

    const { canRead: canReadPermissions } = useCrudChecker('auth\\permission')
    const { canRead: canReadUsers } = useCrudChecker('auth\\user')
    const { canRead: canReadClients } = useCrudChecker('auth\\client')

    const chipErrors = (field: string) => computed(() => getChipErrors(field, props.errors))

    return {
      role,
      canReadUsers,
      canReadPermissions,
      canReadClients,
      chipErrors
    }
  }
})
</script>
