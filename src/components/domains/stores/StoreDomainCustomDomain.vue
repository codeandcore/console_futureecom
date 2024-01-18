<template>
  <div>
    <div v-if="value.id" class="d-flex align-center mb-4 flex-gap-8">
      <span>{{ $t('Default Store Domain') }}:</span>
      <external-link :value="defaultDomain" :label="defaultDomain" />
    </div>
    <v-text-field
      v-model="custom"
      outlined
      :label="$t('Custom Store Domain (optional)')"
      v-bind="$attrs"
      hide-details="auto"
    />
    <span v-if="!value.id" class="text-caption grey--text d-flex mt-2">
      {{ $t('store.wizard.custom.domain') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ExternalLink from '@/components/common/ExternalLink.vue'
import type { PropType } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'StoreDomainCustomDomain',
  components: { ExternalLink },
  props: {
    value: {
      type: Object as PropType<Store>,
      required: true
    }
  },

  setup(props, { emit }) {
    const defaultDomain = ref<string>(props.value.domain?.default || '')

    const custom = computed({
      get: () => (props.value.domain ? props.value.domain.custom : ''),
      set: (val) => {
        const custom = val || undefined
        emit('input', {
          ...props.value,
          domain: custom ? { ...props.value.domain, custom, scheme: 'https' } : null
        })
      }
    })

    return {
      defaultDomain,
      custom
    }
  }
})
</script>
