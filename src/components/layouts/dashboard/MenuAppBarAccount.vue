<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn text small v-bind="attrs" v-on="on">
        <span class="font-weight-bold text-body-1">{{ getNameFirstLetters }}</span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item :to="{ name: 'my-account' }">
        <v-list-item-title>
          <span>{{ $t('My account') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title>
          <span>{{ $t('Logout') }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getUserFromToken } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import { useRouter } from '@intlify/vue-router-bridge'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'MenuAppBarAccount',

  setup() {
    const router = useRouter()

    const api = useApi()
    const getNameFirstLetters = computed(() => {
      const name = getUserFromToken(api.config.accessToken)?.profile.name || 'Admin User'
      return name
        .split(' ')
        .map((item: string) => item[0])
        .join('')
        .toUpperCase()
    })

    return {
      getNameFirstLetters,
      logout: (): void => {
        api.auth.logout()
        router.push({ name: 'login' })
      }
    }
  }
})
</script>
