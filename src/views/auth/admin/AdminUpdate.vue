<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'admins' }"
            :header="`${isOverview ? 'Super Admin' : 'Admin'}: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex flex-gap-16">
                <user-action-delete
                  v-if="canDelete"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @success="redirectToGrid"
                  @error="onRequestError"
                />
                <v-btn
                  v-if="canUpdate"
                  depressed
                  color="primary"
                  :disabled="!isValid || !privilegesIsValid"
                  :loading="loading.update"
                  type="submit"
                >
                  {{ $t('Update') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div v-if="item" class="d-flex flex-column align-center">
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
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import UserActionDelete from '@/components/domains/auth/users/actions/UserActionDelete.vue'
import UserDetails from '@/views/auth/admin/sections/UserDetails.vue'
import UserPrivileges from '@/views/auth/admin/sections/UserPrivileges.vue'
import UserRepresentative from '@/views/auth/admin/sections/UserRepresentative.vue'
import UserSecurity from '@/views/auth/admin/sections/UserSecurity.vue'
import isOverview from '@/composable/repositories/useOverview'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'AdminsUpdate',

  components: {
    ResourceHeader,
    RtlChevronIcon,
    UserActionDelete,
    FormValidatorWrapper,
    ScrollableResource,
    UserRepresentative
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('auth\\user')

    const { organisation, id } = route.params
    const api = useApi({ organisation: Number(organisation), store: 0 })

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const sections = computed(() => {
      const sections = [
        { code: 'details', name: t('Details'), component: UserDetails },
        { code: 'security', name: t('Security'), component: UserSecurity },
        { code: 'privileges', name: t('Privileges'), component: UserPrivileges }
      ]
      if (!isOverview.value) {
        //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
        sections.push({ code: 'commissions', name: t('Commissions'), component: UserRepresentative })
      }
      return sections
    })

    const item = ref<User>()
    const privileges = computed(() => {
      const privileges = [...(item.value?.role_ids || []), ...(item.value?.permission_ids || [])]
      return { privileges }
    })

    const userValidation = useValidator()
    const privilegesValidation = useValidator(privileges.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      email: ['required', 'email']
    }

    const privilegesRule = {
      privileges: ['required']
    }

    const onItemChange = () => {
      if (item.value) {
        userValidation.validate(item.value, rules)
      }
      privilegesValidation.validate(privileges.value, privilegesRule)
    }

    const redirectToGrid = () => router.push({ name: 'admins' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'admin-create' }) : redirectToGrid()
        return
      }
      if (status === HTTPResponseCode.UNPROCESSABLE_CONTENT) {
        userValidation.setErrorsFromAPI(data.errors || {})
      }
      addErrorToast(data.message)
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      userValidation.validate(item.value, rules, true)
      privilegesValidation.validate(privileges.value, privilegesRule, true)

      if (!userValidation.isValid.value || !privilegesValidation.isValid.value) {
        return
      }

      loading.update = true

      const { organisation, id, type, roles, permissions, ...rest } = item.value
      //@ts-expect-error
      const { password, password_confirmation, require_password_change, ...withoutPassword } = rest

      api.auth
        .updateUser(item.value.id, withoutPassword)
        .then((val) => {
          addSuccessToast(t(`Updated ${organisation ? 'admin' : 'super admin'}`))
          item.value = val
          userValidation.setModel(item.value)
        })
        .catch((err) => {
          addErrorToast(t(`Unable to update ${organisation ? 'admin' : 'super admin'}`))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          userValidation.setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.update = false))
    }

    api.auth
      .getUser(`${id}`)
      .then((val) => {
        item.value = val
        userValidation.setModel(item.value)
        privilegesValidation.setModel(privileges.value)
      })
      .catch((err) => onRequestError(err))
      .finally(() => (loading.get = false))

    return {
      sections,
      isOverview,
      canUpdate,
      canDelete,
      item,
      errors: userValidation.errors,
      privilegesErrors: privilegesValidation.errors,
      isValid: userValidation.isValid,
      privilegesIsValid: privilegesValidation.isValid,
      loading,
      updateHandler,
      redirectToGrid,
      onItemChange,
      onRequestError
    }
  }
})
</script>
