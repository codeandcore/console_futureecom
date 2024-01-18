<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header
            v-if="item"
            :header="`${$t('Notification template')}: ${item.code}`"
            :subheader="item.id"
            :back-to="{ name: 'notification-templates' }"
          >
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn
                  v-if="$canAny('manage,notifications\\template', 'update,notifications\\template')"
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
              <notification-template-inputs v-model="item" />
            </div>
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { NotificationTemplateChannel } from '@futureecom/futureecom-js/dist/services/notification-service'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import NotificationTemplateInputs from '@/components/domains/notificationTemplates/NotificationTemplateInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type {
  UpdateNotificationTemplate,
  UpdateNotificationTemplateMail,
  UpdateNotificationTemplateSMS
} from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'NotificationTemplateUpdate',

  components: {
    NotificationTemplateInputs,
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper
  },

  setup(props, { root }) {
    const api = useApi()

    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const item = ref<NotificationTemplate>()

    const redirectToGrid = () => root.$router.push({ name: 'notification-templates' })

    const onErrorFetch = () => {
      root.$toast.addErrorToast('Template not found')
      redirectToGrid()
    }

    const getUpdateSMS = (item: NotificationTemplate): UpdateNotificationTemplateSMS => ({
      channel: NotificationTemplateChannel.SMS,
      subject: item.subject || null,
      body: item.body || ''
    })

    const getUpdateMail = (item: NotificationTemplate): UpdateNotificationTemplateMail => ({
      channel: NotificationTemplateChannel.MAIL,
      subject: item.subject || '',
      body: item.body || ''
    })

    const getUpdateData = (item: NotificationTemplate): UpdateNotificationTemplate => {
      return item.channel === NotificationTemplateChannel.MAIL ? getUpdateMail(item) : getUpdateSMS(item)
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.notifications
        .updateTemplate(item.value.id, getUpdateData(item.value))
        .then((val) => {
          root.$toast.addSuccessToast('Updated template')
          item.value = val
        })
        .catch(() => root.$toast.addErrorToast('Unable to update template'))
        .finally(() => (loading.update = false))
    }

    api.notifications
      .getTemplate(root.$route.params.id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      updateHandler,
      loading,
      item
    }
  }
})
</script>
