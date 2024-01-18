<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'admins' }" :header="`Add new ${$t(isOverview ? 'super admin' : 'admin')}`">
          <template #actions>
            <div class="d-flex justify-end flex-gap-16">
              <v-btn
                :disabled="!isValid || !privilegesIsValid"
                depressed
                color="primary"
                :loading="loading"
                type="submit"
              >
                {{ $t('Create') }}
              </v-btn>
            </div>
          </template>
        </resource-header>
        <v-divider />
      </template>

      <template #scrollable.content>
        <div class="my-6 d-flex flex-column align-center flex-gap-32">
          <component
            :is="section.component"
            v-for="section in sections"
            :key="`content-${section.code}`"
            v-model="item"
            class="d-flex flex-column flex-gap-16 col-10"
            :errors="{ ...errors, ...privilegesErrors }"
            @input="onItemChange"
          />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { UserType } from '@futureecom/futureecom-js/dist/services/auth-service'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import UserDetails from '@/views/auth/admin/sections/UserDetails.vue'
import UserPrivileges from '@/views/auth/admin/sections/UserPrivileges.vue'
import UserRepresentative from '@/views/auth/admin/sections/UserRepresentative.vue'
import UserSecurity from '@/views/auth/admin/sections/UserSecurity.vue'
import isOverview from '@/composable/repositories/useOverview'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { UserRequest } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'AdminsSingle',
  components: {
    ResourceHeader,
    RtlChevronIcon,
    FormValidatorWrapper,
    ScrollableResource
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const loading = ref(false)

    const item = ref<UserRequest>({
      name: '',
      email: '',
      type: UserType.ADMIN,
      role_ids: [],
      permission_ids: [],
      password: '',
      password_confirmation: '',
      require_password_change: false
    })

    const privileges = computed(() => {
      const privileges = [...(item.value.role_ids || []), ...(item.value.permission_ids || [])]
      return { privileges }
    })

    //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
    const userValidation = useValidator(item.value)
    const privilegesValidation = useValidator(privileges.value)

    const rules = computed((): RuleDefinitions => {
      return {
        name: ['required', 'string'],
        email: ['required', 'email'],
        //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
        password: item.value.generate_password ? [] : ['required', 'string', 'min:8']
      }
    })

    const privilegesRule = {
      privileges: ['required']
    }

    const onItemChange = () => {
      //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
      userValidation.validate(item.value, rules.value)
      privilegesValidation.validate(privileges.value, privilegesRule)
    }

    const sections = computed(() => {
      const sections = [
        { code: 'details', name: t('Details'), component: UserDetails },
        { code: 'security', name: t('Security'), component: UserSecurity },
        { code: 'privileges', name: t('Privileges'), component: UserPrivileges }
      ]
      if (!isOverview.value) {
        //@ts-expect-error
        sections.push({ code: 'commissions', name: t('Commissions'), component: UserRepresentative })
      }
      return sections
    })

    const createHandler = () => {
      //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
      userValidation.validate(item.value, rules.value, true)
      privilegesValidation.validate(privileges.value, privilegesRule, true)

      if (!userValidation.isValid.value || !privilegesValidation.isValid.value) {
        return
      }

      const organisation = Number(route.params.organisation)

      loading.value = true

      const { type, ...rest } = item.value

      useApi({ organisation, store: 0 })
        //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
        .auth.createUser({ ...rest, type: isOverview.value ? 'super_admin' : 'admin' })
        .then(({ id }) => {
          addSuccessToast(`Created ${organisation ? 'admin' : 'super admin'}`)
          router.push({ name: 'admin-update', params: { id } }).catch()
        })
        .catch((err) => {
          addErrorToast(t(`Unable to create ${organisation ? 'admin' : 'super admin'}`))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          userValidation.setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.value = false))
    }

    return {
      sections,
      isOverview,
      item,
      loading,
      errors: userValidation.errors,
      isValid: userValidation.isValid,
      privilegesErrors: privilegesValidation.errors,
      privilegesIsValid: privilegesValidation.isValid,
      createHandler,
      onItemChange
    }
  }
})
</script>
