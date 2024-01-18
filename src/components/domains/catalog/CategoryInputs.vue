<template>
  <div class="d-flex flex-column flex-gap-32">
    <translation-tabs :translatable-values="['translations']">
      <template #default.translations>
        <category-name v-model="category" :rules="rules.name" />
        <category-description v-model="category" />
      </template>
      <template #translations="{ code }">
        <category-name v-model="category" :translation-code="code" />
        <category-description v-model="category" :translation-code="code" />
      </template>
    </translation-tabs>

    <category-code v-model="category" :disabled="!!value.id" />
    <category-slug v-model="category" />
    <category-image-url v-model="category" />
    <category-application v-model="category" />

    <category-customer-group v-model="category" />
    <category-product-ids v-model="category" />
    <category-tag-ids v-model="category" />

    <category-parent-ids v-model="category" />
    <category-children-ids v-model="category" />
    <category-sort-order v-model="category" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import CategoryApplication from '@/components/domains/catalog/category/CategoryApplication.vue'
import CategoryChildrenIds from '@/components/domains/catalog/category/CategoryChildrenIds.vue'
import CategoryCustomerGroup from '@/components/domains/catalog/category/CategoryCustomerGroup.vue'
import CategoryParentIds from '@/components/domains/catalog/category/CategoryParentIds.vue'
import CategoryProductIds from '@/components/domains/catalog/category/CategoryProductIds.vue'
import CategoryTagIds from './category/CategoryTagIds.vue'
import CodeInput from '@/components/foundation/CodeInput.vue'
import DescriptionInput from '@/components/foundation/DescriptionInput.vue'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import SlugInput from '@/components/foundation/SlugInput.vue'
import SortOrderInput from '@/components/foundation/SortOrderInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CategoryInputs',

  components: {
    CategoryTagIds,
    CategoryCode: CodeInput,
    CategoryName: NameInput,
    CategorySortOrder: SortOrderInput,
    CategoryParentIds,
    CategoryCustomerGroup,
    CategoryApplication,
    CategoryChildrenIds,
    CategoryProductIds,
    CategoryImageUrl: ImageUrlInput,
    CategorySlug: SlugInput,
    CategoryDescription: DescriptionInput,
    TranslationTabs
  },

  props: {
    value: {
      type: Object as PropType<Category>,
      required: true
    }
  },

  emits: {
    input: (_value: Category) => true
  },

  setup(props, { emit }) {
    const category = computed({
      get: (): Category => props.value,
      set: (val: Category) => emit('input', val)
    })

    const rules = {
      name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    return {
      category,
      rules
    }
  }
})
</script>
