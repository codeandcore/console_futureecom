<template>
  <content-input v-model="content" v-bind="$attrs" :type="value.type" :label="$t('Content')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { parseJsonToString } from '@/composable/useCms'
import ContentInput from '@/components/domains/cms/ContentInputs.vue'
import type { Block } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BlockContent',
  components: { ContentInput },

  props: {
    value: {
      type: Object as PropType<Block>,
      required: true
    }
  },

  setup(props, { emit }) {
    const content = computed({
      get: () => props.value.content,
      set: (content) => emit('input', { ...props.value, content: parseJsonToString(content) })
    })

    return {
      content
    }
  }
})
</script>
