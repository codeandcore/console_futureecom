<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header v-if="item" :back-to="{ name: 'webhooks' }" :header="$t('Webhook')" :subheader="webhook.id">
            <template #actions>
              <div v-if="webhook" class="d-flex justify-end flex-gap-16">
                <webhook-action-delete
                  v-if="$canAny('manage,notifications\\webhook', 'delete,notifications\\webhook')"
                  :value="webhook"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToWebhookGrid"
                />
                <v-btn
                  v-if="$canAny('manage,notifications\\webhook', 'update,notifications\\webhook')"
                  depressed
                  color="primary"
                  :disabled="!valid || loading.delete"
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
            <div class="my-6 col-10 d-flex flex-column flex-gap-32">
              <readonly-card>
                <div class="d-flex flex-gap-8">
                  <span>{{ $t('Client ID') }}:</span>
                  <router-link
                    :is="canAccessWebhookClient ? 'router-link' : 'span'"
                    v-if="webhook"
                    :to="{
                      name: 'client-update',
                      params: { organisation: webhook.client_organisation, store: 0, id: webhook.client_id }
                    }"
                  >
                    {{ webhook.client_id }}
                  </router-link>
                </div>
              </readonly-card>

              <webhook-inputs v-model="item" />
            </div>
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { canAny } from '@/composable/useCanChecker'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useStores } from '@/composable/repositories/useStores'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ReadonlyCard from '@/components/common/ReadonlyCard.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import WebhookActionDelete from '@/components/domains/webhooks/actions/WebhookActionDelete.vue'
import WebhookInputs from '@/components/domains/webhooks/WebhookInputs.vue'
import useApi from '@/composable/useApi'
import type { Webhook, WebhookData } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookUpdate',

  components: {
    ReadonlyCard,
    WebhookInputs,
    WebhookActionDelete,
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper
  },

  setup(props, { root }) {
    const { collection: organisations } = useOrganisations()
    const { currentStore } = useStores()

    const api = useApi()

    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const item = ref<WebhookData>()
    const webhook = ref<Webhook>()

    const redirectToWebhookGrid = () => root.$router.push({ name: 'webhooks' })

    const onErrorFetch = () => {
      root.$toast.addErrorToast('Webhook not found')
      const canCreate = root.$canAny('manage,notifications\\webhook', 'create,notifications\\webhook').value
      canCreate ? redirectToWebhookGrid() : root.$router.push({ name: 'webhook-create' }).catch()
    }

    const updateHandler = () => {
      if (!item.value || !webhook.value) {
        return
      }

      loading.update = true

      api.notifications
        .updateWebhook(webhook.value.id, item.value)
        .then((val) => {
          root.$toast.addSuccessToast('Updated webhook')
          const { events, url } = val
          item.value = { events, url, secret: '' }
        })
        .catch(() => root.$toast.addErrorToast('Unable to update webhook'))
        .finally(() => (loading.update = false))
    }

    api.notifications
      .getWebhook(root.$route.params.id)
      .then((val) => {
        webhook.value = val
        item.value = { events: val.events, url: val.url, secret: '' }
      })
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    const canAccessWebhookClient = computed(() => {
      const organisation = (organisations.value || []).find((org) => org.id === webhook.value?.client_organisation)
      const orgCode = organisation?.code || currentStore.value?.organisation_code || ''

      return canAny(['manage,auth\\client', 'manage,auth\\client'], orgCode, currentStore.value?.code).value
    })

    return {
      updateHandler,
      redirectToWebhookGrid,
      loading,
      item,
      webhook,
      canAccessWebhookClient
    }
  }
})
</script>
