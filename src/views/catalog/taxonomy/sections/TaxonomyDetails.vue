<template>
  <translation-tabs :translatable-values="['name']" class="mb-10">
    <template #default.name>
      <taxonomy-name v-model="taxonomy" :rules="validator.rules.name" />
    </template>
    <template #name="{ code }">
      <taxonomy-name v-model="taxonomy" :translation-code="code" />
    </template>
  </translation-tabs>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { TaxonomyValidator } from '@/composable/resources/useTaxonomy'

export default defineComponent({
  name: 'TaxonomyDetails',

  components: { TaxonomyName: NameInput, TranslationTabs },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    },
    validator: {
      type: Object as PropType<TaxonomyValidator>,
      required: true
    }
  },

  setup(props, { emit }) {
    const taxonomy = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      taxonomy
    }
  }
})
</script>
