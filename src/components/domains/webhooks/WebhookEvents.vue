<template>
  <v-combobox
    v-bind="$attrs"
    v-model="events"
    hide-details="auto"
    outlined
    :label="$t('Events')"
    chips
    deletable-chips
    multiple
    persistent-hint
    append-icon=""
    :search-input.sync="searchInput"
    @update:search-input="onSearchInputUpdate"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { WebhookData } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookEvents',

  props: {
    value: {
      type: Object as PropType<WebhookData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const events = computed({
      get: () => props.value.events || [],
      set: (events) => emit('input', { ...props.value, events })
    })

    const searchInput = ref('')

    const onSearchInputUpdate = (value: string | null) => {
      if (!(value || '').includes(' ')) {
        return
      }

      events.value = [...props.value.events, searchInput.value.trim()]
      searchInput.value = ''
    }

    return {
      events,
      searchInput,
      onSearchInputUpdate
    }
  }
})
</script>
