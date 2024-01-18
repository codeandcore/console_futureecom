<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <span>{{ $t('Associated Customers') }}</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <user-associated-customers v-model="user" class="d-flex flex-column flex-gap-16" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel v-if="user.id && canReadRepresentative">
        <v-expansion-panel-header>
          <span>{{ $t('Sales representative') }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="d-flex justify-end">
            <v-btn
              v-if="canCreateRepresentative"
              color="primary"
              small
              depressed
              :to="{ name: 'representative-create', params: { admin: $route.params.id } }"
            >
              {{ $t('Add commission rate') }}
            </v-btn>
          </div>
          <user-sales-representative :id="value.id" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-divider />
      <v-expansion-panel v-if="user.id && canReadCommissions">
        <v-expansion-panel-header>
          <span>{{ $t('Commissions') }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <user-commissions :id="value.id" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import UserAssociatedCustomers from '@/components/domains/auth/users/UserAssociatedCustomers.vue'
import UserCommissions from '@/components/domains/auth/users/representative/UserCommissions.vue'
import UserSalesRepresentative from '@/components/domains/auth/users/representative/UserSalesRepresentative.vue'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserRepresentative',
  components: { UserAssociatedCustomers, UserCommissions, UserSalesRepresentative },

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    }
  },

  setup(props, { emit }) {
    const user = computed({
      get: () => props.value,
      set: (user) => emit('input', user)
    })

    const { canRead: canReadCommissions } = useCrudChecker('commission\\commission')
    const { canRead, canCreate } = useCrudChecker('commission\\representative')

    return {
      user,
      canReadRepresentative: canRead,
      canCreateRepresentative: canCreate,
      canReadCommissions
    }
  }
})
</script>
