<template>
  <div class="d-flex flex-column flex-gap-32">
    <div class="d-flex flex-gap-16">
      <notification-template-code v-model="template" :disabled="!!value.id" />
      <notification-template-channel v-model="template" :disabled="!!value.id" />
    </div>
    <notification-template-subject v-model="template" :rules="rules.subject" />
    <div>
      <v-slide-y-reverse-transition mode="out-in">
        <v-alert v-if="HtmlTagWarning" type="warning" dismissible>
          {{ $t('Avoid using HTML tags in SMS') }}
        </v-alert>
      </v-slide-y-reverse-transition>
      <notification-template-body v-model="template" :rules="rules.body" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import NotificationTemplateBody from './NotificationTemplateBody.vue'
import NotificationTemplateChannel from './NotificationTemplateChannel.vue'
import NotificationTemplateCode from './NotificationTemplateCode.vue'
import NotificationTemplateSubject from './NotificationTemplateSubject.vue'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'NotificationTemplateInputs',

  components: {
    NotificationTemplateBody,
    NotificationTemplateSubject,
    NotificationTemplateChannel,
    NotificationTemplateCode
  },

  props: {
    value: {
      type: Object as PropType<NotificationTemplate>,
      required: true
    }
  },

  setup(props, { emit }) {
    const template = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = {
      subject: props.value.channel === 'mail' ? [(val: string): ValidationRule => useNotEmptyValidationRule(val)] : [],
      body: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    const HtmlTagWarning = computed(() => template.value.channel === 'vonage' && /<[^>]+>/.test(template.value.body))

    return {
      HtmlTagWarning,
      template,
      rules
    }
  }
})
</script>
