<template>
  <div class="d-flex flex-column flex-gap-32 my-6 col-10">
    <brand-order v-model="brand" />
    <translation-tabs :translatable-values="['name', 'description']" :errors="errors">
      <template #default.name>
        <brand-name v-model="brand" :error-messages="errors['name']" />
      </template>
      <template #name="{ code }">
        <brand-name v-model="brand" :translation-code="code" />
      </template>
      <template #default.description>
        <brand-description v-model="brand" />
      </template>
      <template #description="{ code }">
        <brand-description v-model="brand" :translation-code="code" />
      </template>
    </translation-tabs>

    <brand-slug v-model="brand" :error-messages="errors['slug']" />

    <brand-image-url v-model="brand" />

    <div v-if="canRead" class="d-flex flex-column flex-gap-16">
      <span class="grey--text text--darken-2">{{ $t('Related products') }}</span>
      <brand-products
        v-model="brand"
        :items="brand.products || undefined"
        :grid-options="options"
        show-chips
        multiple
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import DescriptionInput from '@/components/foundation/DescriptionInput.vue'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'
import SlugInput from '@/components/foundation/SlugInput.vue'
import SortOrderInput from '@/components/foundation/SortOrderInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { BrandData } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'BrandInputs',

  components: {
    TranslationTabs,
    BrandOrder: SortOrderInput,
    BrandName: NameInput,
    BrandSlug: SlugInput,
    BrandDescription: DescriptionInput,
    BrandImageUrl: ImageUrlInput,
    BrandProducts: SelectableProducts
  },

  props: {
    value: {
      type: Object as PropType<BrandData>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const brand = computed({
      get: (): BrandData => props.value,
      set: (val) => emit('input', val)
    })

    const { canRead } = useCrudChecker('catalog\\product')

    const options = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Image'), value: 'image_url', sortable: false },
        { text: t('Name'), value: 'name' },
        { text: t('SKU'), value: 'sku' },
        { text: t('Classification'), value: 'classification' }
      ]

      return { headers }
    })

    return {
      brand,
      options,
      canRead
    }
  }
})
</script>
