<template>
  <div>
    <div v-if="value.id" class="d-flex align-center mb-4 flex-gap-8">
      <span class="text-capitalize">{{ $t(`Default ${appName} Domain`) }}:</span>
      <external-link :value="defaultDomain" :label="defaultDomain" />
    </div>

    <v-text-field
      v-model="customConsole"
      :label="$t(`Custom ${appName} Domain (optional)`)"
      outlined
      v-bind="$attrs"
      hide-details="auto"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ExternalLink from '@/components/common/ExternalLink.vue'
import dotProp from 'dot-prop'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrganisationDomainCustom',

  components: { ExternalLink },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<Organisation>,
      required: true
    },
    app: {
      type: [] as PropType<'console' | 'pos'>,
      required: true
    }
  },

  setup(props, { emit }) {
    const defaultDomain = ref<string>(props.value.domains?.console?.default || '')

    const path = props.value.id ? `domains.${props.app}.custom` : `${props.app}_domain`

    const appName = computed(() => (props.app === 'pos' ? 'Point-of-Sale' : props.app))

    const customConsole = computed({
      get: () => dotProp.get(props.value, path, ''),
      set: (custom) => emit('input', dotProp.set(props.value, path, custom))
    })

    return {
      defaultDomain,
      customConsole,
      appName
    }
  }
})
</script>
