<template>
  <div>
    <span>{{ $t('Note') }}:</span>
    <span>{{ `${note}` }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { LabeledNote } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewItemNote',

  props: {
    value: {
      //TODO: https://futureecom.atlassian.net/browse/FT-592
      type: [] as PropType<string | string[] | LabeledNote | undefined>,
      required: true
    }
  },

  setup(props) {
    const note = computed(() => (Array.isArray(props.value) ? props.value[0] : props.value) || '')

    return {
      note
    }
  }
})
</script>
