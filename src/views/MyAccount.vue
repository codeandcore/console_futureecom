<template>
  <scrollable-wrapper @submit="submit">
    <template #top="{ valid }">
      <resource-header :header="$t('My Account')">
        <template #actions>
          <div class="d-flex justify-end flex-gap-16">
            <v-btn depressed color="primary" :disabled="!valid" :loading="loading.update" type="submit">
              {{ $t('Update') }}
            </v-btn>
          </div>
        </template>
      </resource-header>
      </resource-header>
    </template>
    <template #content>
      <div class="d-flex flex-column align-center">
        <my-account-inputs
          v-if="item"
          :key="item.updated_at"
          v-model="item"
          class="my-6 col-10 d-flex flex-column flex-gap-16"
        />
      </div>
    </template>
  </scrollable-wrapper>
</template>

<script lang='ts'>
import { defineComponent, reactive } from '@vue/composition-api'
import { useMyAccount } from '@/composable/repositories/useAccount'
import MyAccountInputs from '@/components/domains/auth/MyAccountInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'

export default defineComponent({
  name: 'MyAccount',

  components: { ResourceHeader, MyAccountInputs, ScrollableWrapper },

  setup(props, { root }) {
    const { myAccount: item, fetchMyAccount, updateMyAccount } = useMyAccount()

    const loading = reactive({
      get: false,
      update: false
    })

    if (!item.value) {
      loading.get = true
      fetchMyAccount()
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to fetch your account info')))
        .finally(() => (loading.get = false))
    }

    const submit = (): void => {
      if (!item.value) {
        return
      }

      loading.update = true
      //@ts-expect-error
      const { email, name, password, password_confirmation } = item.value
      const payload = { email, name, password, password_confirmation }
      updateMyAccount(payload)
        .then(() => root.$toast.addSuccessToast(root.$t('Your account has been updated')))
        .catch(() => root.$toast.addSuccessToast(root.$t('Unable to update your account')))
        .finally(() => (loading.update = false))
    }

    return {
      item,
      submit,
      loading
    }
  }
})
</script>
