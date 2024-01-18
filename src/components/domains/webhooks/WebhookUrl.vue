<template>
  <v-text-field v-bind="$attrs" v-model="url" :label="$t('URL')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { WebhookData } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookUrl',

  props: {
    value: {
      type: Object as PropType<WebhookData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const url = computed({
      get: () => props.value.url,
      set: (url) => emit('input', { ...props.value, url })
    })

    return {
      url
    }
  }
})
</script>
