<template>
  <div>
    <user-name v-model="user" :error-messages="errors['name']" class="required" />
    <user-email v-model="user" :error-messages="errors['email']" class="required" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import UserEmail from '@/components/domains/auth/users/UserEmail.vue'
import UserName from '@/components/domains/auth/users/UserName.vue'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'UserDetails',

  components: {
    UserName,
    UserEmail
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
