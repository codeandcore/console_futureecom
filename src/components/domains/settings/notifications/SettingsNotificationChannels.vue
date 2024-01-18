<template>
  <div>
    <h2 class="my-4">
      {{ $t('Notification') }}
    </h2>
    <span class="text-caption">{{ $t('List of notifications types that should be enabled.') }}</span>

    <form-validator-wrapper @submit="updateHandler">
      <template #default="{ valid }">
        <div class="d-flex flex-column">
          <div
            v-for="channel in channels"
            :key="`${channel.code}`"
            class="d-flex flex-row align-center justify-space-between"
          >
            <v-switch v-model="form.enabled" :value="channel.code" :label="channel.name" />
          </div>
        </div>
        <div class="d-flex justify-end">
          <v-btn small depressed color="primary" :disabled="!valid || !canUpdate" :loading="loading" type="submit">
            {{ $t('Update channels ') }}
          </v-btn>
        </div>
      </template>
    </form-validator-wrapper>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import type { NotificationChannelsSetting, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationChannels',
  components: { FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)

    const channels = computed(() => [
      { code: 'mail', name: t('Mail') },
      { code: 'vonage', name: t('SMS') }
    ])

    const form = ref<NotificationChannelsSetting>(props.value.notifications?.channels || { enabled: null })

    const { canUpdate } = useCrudChecker('settings\\notifications')

    const updateHandler = (): void => {
      loading.value = true
      useSettings()
        .updateSettings('notifications.channels', form.value)
        .then(() => addSuccessToast(t('Updated settings')))
        .catch(() => addErrorToast(t('Unable to update settings')))
        .finally(() => (loading.value = false))
    }

    return {
      channels,
      form,
      loading,
      canUpdate,
      updateHandler
    }
  }
})
</script>
