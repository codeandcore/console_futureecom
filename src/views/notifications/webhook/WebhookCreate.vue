<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header :back-to="{ name: 'webhooks' }" :header="$t('Add new webhook')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn v-bind="$attrs" :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div v-if="item" class="d-flex flex-column align-center">
            <webhook-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import WebhookInputs from '@/components/domains/webhooks/WebhookInputs.vue'
import useApi from '@/composable/useApi'
import type { WebhookData } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookCreate',

  components: {
    WebhookInputs,
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const item = ref<WebhookData>({
      events: [],
      url: '',
      secret: ''
    })

    const createHandler = () => {
      if (!item.value) {
        return
      }

      loading.value = true
      api.notifications
        .createWebhook(item.value)
        .then(({ id }) => {
          root.$toast.addSuccessToast('Created webhook')
          root.$router.push({ name: 'webhook-update', params: { id } })
        })
        .catch(() => root.$toast.addErrorToast('Unable to create webhook'))
        .finally(() => (loading.value = false))
    }

    return {
      createHandler,
      loading,
      item
    }
  }
})
</script>
