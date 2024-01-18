<template>
  <select-application v-model="product" multiple :app-types="appTypes" />
</template>

<script lang="ts">
import { ApplicationType } from '@futureecom/futureecom-js'
import { arrayOrNull } from '@/libs/arrays'
import { computed, defineComponent } from '@vue/composition-api'
import SelectApplication from '@/components/common/selectables/SelectApplication.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductApplication',

  components: { SelectApplication },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value.application,
      set: (application) => emit('input', { ...props.value, application: arrayOrNull(application) })
    })

    return {
      product,
      appTypes: [ApplicationType.CONSOLE, ApplicationType.STOREFRONT, ApplicationType.POS]
    }
  }
})
</script>
