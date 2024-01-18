<template>
  <select-application v-bind="$attrs" v-model="application" multiple hide-details="auto" :app-types="appTypes" />
</template>

<script lang="ts">
import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { arrayOrNull } from '@/libs/arrays'
import { computed, defineComponent } from '@vue/composition-api'
import SelectApplication from '@/components/common/selectables/SelectApplication.vue'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyApplication',
  components: { SelectApplication },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    }
  },

  setup(props, { emit }) {
    const application = computed({
      get: () => props.value.application,
      set: (application) => emit('input', { ...props.value, application: arrayOrNull(application) })
    })

    return {
      application,
      appTypes: [ApplicationType.CONSOLE, ApplicationType.STOREFRONT, ApplicationType.POS]
    }
  }
})
</script>
