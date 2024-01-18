<template>
  <form-validator-wrapper @submit="onSubmit">
    <template #default="{ valid }">
      <v-card-text>
        <login-inputs v-model="form" class="d-flex flex-column flex-gap-16" />
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between ma-2 align-center">
        <div>
          <router-link :to="{ name: 'forgot-password' }">{{ $t('Forgot password') }}?</router-link>
        </div>
        <div>
          <v-btn depressed :disabled="!valid" :loading="loading" color="primary" type="submit" data-cy="submit-button">
            {{ $t('Login') }}
          </v-btn>
        </div>
      </v-card-actions>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { api, configureApi, refreshTenancyKeys } from '@/libs/api'
import { defineComponent, ref } from '@vue/composition-api'
import { getClientId, getOrganisationId, getStoreId } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import LoginInputs from '@/components/login/LoginInputs.vue'
import type { TokenRequestPassword } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'Login',

  components: { LoginInputs, FormValidatorWrapper },

  setup() {
    const router = useRouter()
    const { addErrorToast } = useToasts()

    const loading = ref(false)

    const form = ref<TokenRequestPassword>({
      client_id: api.config.clientId || undefined,
      grant_type: 'password',
      username: '',
      password: ''
    })

    const onSubmit = (): void => {
      loading.value = true

      api.auth
        .login(form.value)
        .then(({ access_token }) => {
          const clientId: string | undefined = getClientId(access_token)
          const tokenOrg: number | undefined = getOrganisationId(access_token)
          const tokenStore: number | undefined = getStoreId(access_token)

          refreshTenancyKeys.value = { organisation: tokenOrg || 0, store: tokenStore }

          configureApi(clientId, tokenOrg)

          router.push({ name: 'dashboard', params: { organisation: `${tokenOrg}` || '', store: '0' } })
        })
        .catch((err: any) => addErrorToast(err.response.data.message))
        .finally(() => (loading.value = false))
    }

    return {
      loading,
      onSubmit,
      form
    }
  }
})
</script>
