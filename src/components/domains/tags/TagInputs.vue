<template>
  <div class="d-flex flex-column flex-gap-16 my-6 col-10">
    <translation-tabs :translatable-values="['name']" :errors="errors">
      <template #default.name>
        <tag-name v-model="tag" :error-messages="errors['name']" />
      </template>
      <template #name="{ code }">
        <tag-name v-model="tag" :translation-code="code" :error-messages="errors[`translations.${code}.name`]" />
      </template>
    </translation-tabs>

    <tag-product-ids v-model="tag" :errors="errors" />
    <tag-category-ids v-model="tag" :errors="errors" />
    <tag-taxonomy-ids v-model="tag" :errors="errors" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import TagCategoryIds from '@/components/domains/tags/TagCategoryIds.vue'
import TagProductIds from '@/components/domains/tags/TagProductIds.vue'
import TagTaxonomyIds from '@/components/domains/tags/TagTaxonomyIds.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { PropType } from '@vue/composition-api'
import type { Tag } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'TagInputs',

  components: {
    TagTaxonomyIds,
    TagProductIds,
    TagCategoryIds,
    TranslationTabs,
    TagName: NameInput
  },

  props: {
    value: {
      type: Object as PropType<Partial<Tag>>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const tag = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      tag
    }
  }
})
</script>
