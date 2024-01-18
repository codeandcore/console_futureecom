<template>
  <script-editor v-model="scripts" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ScriptEditor from '@/components/common/ScriptEditor.vue'
import type { Page } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PageScripts',

  components: { ScriptEditor },

  props: {
    value: {
      type: Object as PropType<Page>,
      required: true
    }
  },

  setup(props, { emit }) {
    const scripts = computed({
      get: () => props.value.scripts || '',
      set: (scripts) => emit('input', { ...props.value, scripts })
    })

    return {
      scripts
    }
  }
})
</script>
