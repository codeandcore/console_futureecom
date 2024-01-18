<template>
  <select-provider v-bind="$attrs" v-model="providers" multiple data-cy="client-input-providers" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SelectProvider from '@/components/common/selectables/SelectProvider.vue'
import type { Client } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ClientProviders',
  components: { SelectProvider },
  props: {
    value: {
      type: Object as PropType<Pick<Client, 'providers'>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const providers = computed({
      get: () => props.value.providers,
      set: (providers) => emit('input', { ...props.value, providers })
    })

    return {
      providers
    }
  }
})
</script>
