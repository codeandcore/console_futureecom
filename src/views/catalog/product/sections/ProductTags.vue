<template>
  <selectable-tags v-model="product" :grid-options="options" show-chips :items="value.tags || undefined" multiple />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectableTags from '@/components/common/selectables/resources/SelectableTags.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ProductTags',

  components: { SelectableTags },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const product = computed({
      get: (): Product => props.value,
      set: (product) => emit('input', product)
    })

    const options = computed(() => {
      const headers: ResourceGridOptions['headers'] = [{ text: t('Name'), value: 'name' }]

      return { headers }
    })

    return {
      product,
      options
    }
  }
})
</script>
