<template>
  <div class="d-flex flex-column flex-gap-32">
    <taxonomy-application v-model="taxonomy" />
    <taxonomy-customer-group v-model="taxonomy" />
    <taxonomy-propagate-to v-model="taxonomy" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TaxonomyApplication from '@/components/domains/taxonomy/TaxonomyApplication.vue'
import TaxonomyCustomerGroup from '@/components/domains/taxonomy/TaxonomyCustomerGroup.vue'
import TaxonomyPropagateTo from '@/components/domains/taxonomy/TaxonomyPropagateTo.vue'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyRestrictions',
  components: { TaxonomyCustomerGroup, TaxonomyApplication, TaxonomyPropagateTo },
  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    }
  },

  setup(props, { emit }) {
    const taxonomy = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      taxonomy,
      hasSelectedGroups: computed(() => (taxonomy.value.customer_group || []).length > 0)
    }
  }
})
</script>
