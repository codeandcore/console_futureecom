<template>
  <div class="d-flex flex-column flex-gap-32">
    <webhook-url v-model="webhook" :rules="rules.url" />
    <webhook-events v-model="webhook" :rules="rules.events" />
    <webhook-secret v-model="webhook" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyArrayValidationRule } from '@/composable/validationRules'
import WebhookEvents from '@/components/domains/webhooks/WebhookEvents.vue'
import WebhookSecret from '@/components/domains/webhooks/WebhookSecret.vue'
import WebhookUrl from '@/components/domains/webhooks/WebhookUrl.vue'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'
import type { WebhookData } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookInputs',

  components: {
    WebhookSecret,
    WebhookEvents,
    WebhookUrl
  },

  props: {
    value: {
      type: Object as PropType<WebhookData>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const webhook = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = {
      url: [
        (val: string): ValidationRule => {
          try {
            return !!new URL(val)
          } catch {
            return root.$t('Invalid URL format')
          }
        }
      ],
      events: [(val: string[]): ValidationRule => useNotEmptyArrayValidationRule(val)]
    }

    return {
      webhook,
      rules
    }
  }
})
</script>
