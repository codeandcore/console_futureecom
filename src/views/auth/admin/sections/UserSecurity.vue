<template>
  <div v-if="!user.id">
    <user-require-password-change v-model="user" />
    <user-generate-password v-model="user" />
    <v-slide-y-transition mode="out-in">
      <user-password v-if="!user.generate_password" v-model="user" :error-messages="errors['password']" />
    </v-slide-y-transition>
  </div>

  <div v-else>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('Security') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <user-password-change-inputs :key="user.updated_at" v-model="user" />
          <v-divider class="my-4" />
          <user-actions-password-actions :value="user" class="d-flex flex-column flex-gap-16" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import GeneratePasswordAction from '@/components/common/actions/GeneratePasswordAction.vue'
import UserActionsPasswordActions from '@/components/domains/auth/users/actions/UserPasswordActions.vue'
import UserGeneratePassword from '@/components/domains/auth/users/UserGeneratePassword.vue'
import UserPassword from '@/components/domains/auth/users/UserPassword.vue'
import UserPasswordChangeInputs from '@/components/domains/auth/UserPasswordChangeInputs.vue'
import UserRequirePasswordChange from '@/components/domains/auth/users/UserRequirePasswordChange.vue'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'UserSecurity',

  components: {
    GeneratePasswordAction,
    UserPassword,
    UserGeneratePassword,
    UserRequirePasswordChange,
    UserActionsPasswordActions,
    UserPasswordChangeInputs
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
    const user = computed({
      get: (): User => props.value,
      set: (user) => emit('input', user)
    })

    return {
      user
    }
  }
})
</script>
 