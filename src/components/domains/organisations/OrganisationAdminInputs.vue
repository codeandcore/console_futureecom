<template>
  <div>
    <user-name v-model="admin" :error-messages="adminErrors['name']" />
    <user-email v-model="admin" :error-messages="adminErrors['email']" />
    <user-password v-model="admin" :error-messages="adminErrors['password']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getErrorsStartingWith, mapErrors } from '@/composable/validator/useValidator'
import UserEmail from '@/components/domains/auth/users/UserEmail.vue'
import UserName from '@/components/domains/auth/users/UserName.vue'
import UserPassword from '@/components/domains/auth/users/UserPassword.vue'
import type { NewOrganisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'OrganisationAdminInputs',

  components: { UserEmail, UserName, UserPassword },

  props: {
    value: {
      type: Object as PropType<NewOrganisation>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  emits: ['resetAdmin'],

  setup(props, { emit }) {
    const admin = computed({
      get: () => props.value.admin,
      set: (admin) => emit('input', { ...props.value, admin })
    })

    const adminErrors = computed(() => {
      const reduced = getErrorsStartingWith('admin.', props.errors)
      return mapErrors('admin.', '', reduced)
    })

    return {
      admin,
      adminErrors
    }
  }
})
</script>
