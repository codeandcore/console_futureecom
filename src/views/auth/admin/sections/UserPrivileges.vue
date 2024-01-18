<template>
  <div>
    <v-scroll-y-transition mode="out-in">
      <span v-if="errors['privileges']" class="error--text text-caption">
        {{ $t('At least one role or permission is required') }}
      </span>
    </v-scroll-y-transition>
    <v-expansion-panels>
      <v-expansion-panel v-if="canReadRoles">
        <v-expansion-panel-header>
          <span class="d-flex flex-gap-4" :class="{ 'error--text': Object.keys(chipErrors('role_ids').value).length }">
            <span>{{ $t('Roles') }}:</span>
            <span v-if="roles.length">({{ `${roles.length}` }})</span>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <user-roles
            v-model="user"
            :items.sync="roles"
            class="d-flex flex-column flex-gap-16"
            :errors="chipErrors('role_ids').value"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="canReadPermissions">
        <v-expansion-panel-header>
          <span
            class="d-flex flex-gap-4"
            :class="{ 'error--text': Object.keys(chipErrors('permission_ids').value).length }"
          >
            <span>{{ $t('Permissions') }}</span>
            <span v-if="permissions.length">({{ `${permissions.length}` }})</span>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <user-permissions
            v-model="user"
            :items.sync="permissions"
            class="d-flex flex-column flex-gap-16"
            :errors="chipErrors('permission_ids').value"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useCrudChecker } from '@/composable/useCrudChecker'
import UserPermissions from '@/components/domains/auth/users/UserPermissions.vue'
import UserRoles from '@/components/domains/auth/users/UserRoles.vue'
import type { Permission, Role, User } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'UserPrivileges',

  components: {
    UserPermissions,
    UserRoles
  },

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const roles = ref<Role[]>(props.value.roles || [])
    const permissions = ref<Permission[]>(props.value.permissions || [])

    const { canRead: canReadRoles } = useCrudChecker('auth\\role')
    const { canRead: canReadPermissions } = useCrudChecker('auth\\permission')

    const user = computed({
      get: (): User => props.value,
      set: (user) => emit('input', user)
    })

    const chipErrors = (field: string) => computed(() => getChipErrors(field, props.errors))

    return {
      user,
      roles,
      permissions,
      canReadRoles,
      canReadPermissions,
      chipErrors
    }
  }
})
</script>
