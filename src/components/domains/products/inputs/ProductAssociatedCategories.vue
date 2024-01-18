<template>
  <selectable-categories
    v-model="product"
    :items="value.categories"
    :grid-options="categoriesOptions"
    show-chips
    multiple
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectableCategories from '@/components/common/selectables/resources/SelectableCategories.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ProductAssociatedCategories',

  components: { SelectableCategories },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const product = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const categoriesOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return {
        headers
      }
    })

    return {
      product,
      categoriesOptions
    }
  }
})
</script>
