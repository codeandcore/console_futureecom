<template>
  <select-application v-bind="$attrs" v-model="application" data-cy="client-input-meta-application" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SelectApplication from '@/components/common/selectables/SelectApplication.vue'
import type { Client } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ClientMetaApplication',

  components: { SelectApplication },

  props: {
    value: {
      type: Object as PropType<Pick<Client, 'meta'>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const application = computed({
      get: (): string => (props.value.meta ? props.value.meta.application : ''),
      set: (application) => emit('input', { ...props.value, meta: { ...props.value.meta, application } })
    })

    return {
      application
    }
  }
})
</script>
