<template>
  <div>
    <client-name v-model="client" :error-messages="errors['name']" />
    <client-default v-if="!isOverview" v-model="client" />
    <client-meta-application v-model="client" :error-messages="errors['meta.application']" />
    <client-providers v-model="client" :error-messages="errors['providers']" />

    <div class="d-flex flex-column flex-gap-16">
      <div class="d-flex flex-column" :class="{ 'error--text': Object.keys(chipErrors('role_ids').value).length }">
        <span>{{ $t('Roles') }}:</span>
      </div>

      <client-roles
        v-if="canReadRoles"
        v-model="client"
        class="d-flex flex-column flex-gap-16"
        :errors="chipErrors('role_ids').value"
      />
      <readonly-card v-else-if="value.roles.length">
        <span>{{ $t('Roles') }}:</span>
        <span>{{ value.roles.map((role) => `${role.name}`).join(', ') }}</span>
      </readonly-card>
    </div>

    <div class="d-flex flex-column flex-gap-16">
      <div
        class="d-flex flex-column"
        :class="{ 'error--text': Object.keys(chipErrors('permission_ids').value).length }"
      >
        <span>{{ $t('Permissions') }}:</span>
      </div>

      <client-permissions
        v-if="canReadPermissions"
        v-model="client"
        class="d-flex flex-column flex-gap-16"
        :errors="chipErrors('permission_ids').value"
      />
      <readonly-card v-else-if="value.permissions.length">
        <span>{{ $t('Permissions') }}:</span>
        <span>{{ value.permissions.map((perm) => `${perm.name}`).join(', ') }}</span>
      </readonly-card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useCrudChecker } from '@/composable/useCrudChecker'
import ClientDefault from '@/components/domains/auth/clients/ClientDefault.vue'
import ClientMetaApplication from '@/components/domains/auth/clients/ClientMetaApplication.vue'
import ClientName from '@/components/foundation/NameInput.vue'
import ClientPermissions from '@/components/domains/auth/clients/ClientPermissions.vue'
import ClientProviders from '@/components/domains/auth/clients/ClientProviders.vue'
import ClientRoles from '@/components/domains/auth/clients/ClientRoles.vue'
import ReadonlyCard from '@/components/common/ReadonlyCard.vue'
import isOverview from '@/composable/repositories/useOverview'
import type { Client } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'ClientInputs',

  components: {
    ReadonlyCard,
    ClientMetaApplication,
    ClientDefault,
    ClientRoles,
    ClientPermissions,
    ClientProviders,
    ClientName
  },

  props: {
    value: {
      type: Object as PropType<Client>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { canRead: canReadRoles } = useCrudChecker('auth\\role')
    const { canRead: canReadPermissions } = useCrudChecker('auth\\permission')

    const client = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const chipErrors = (field: string) => computed(() => getChipErrors(field, props.errors))

    return {
      isOverview,
      canReadRoles,
      canReadPermissions,
      client,
      chipErrors
    }
  }
})
</script>
