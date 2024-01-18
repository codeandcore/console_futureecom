<template>
  <external-link v-if="linkCustom" :label="linkCustom" :value="linkCustom" />
  <external-link v-else-if="linkDefault" :label="linkDefault" :value="linkDefault" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ExternalLink from '@/components/common/ExternalLink.vue'
import dotProp from 'dot-prop'
import type { OrganisationDomains } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrganisationDomainLinks',

  components: { ExternalLink },

  props: {
    value: {
      type: Object as PropType<OrganisationDomains>,
      default: undefined
    },
    app: {
      type: [] as PropType<'console' | 'pos'>,
      required: true
    }
  },

  setup(props) {
    const linkCustom = computed((): string => dotProp.get(props.value, `${props.app}.custom`, ''))
    const linkDefault = computed((): string => dotProp.get(props.value, `${props.app}.default`, ''))

    return {
      linkCustom,
      linkDefault
    }
  }
})
</script>
