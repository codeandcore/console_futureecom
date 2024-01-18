<template>
  <v-text-field v-bind="$attrs" v-model="subject" :label="$t('Subject')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'NotificationTemplateSubject',

  props: {
    value: {
      type: Object as PropType<NotificationTemplate>,
      required: true
    }
  },

  setup(props, { emit }) {
    const subject = computed({
      get: () => props.value.subject,
      set: (subject) => emit('input', { ...props.value, subject })
    })

    return {
      subject
    }
  }
})
</script>
