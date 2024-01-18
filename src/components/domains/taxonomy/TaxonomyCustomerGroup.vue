<template>
  <expandable-content outlined>
    <template #title>
      <span>
        {{ $t('Allowed Groups') }}
        {{ (taxonomy.customer_group || []).length ? `(${taxonomy.customer_group.length})` : `(${$t('all')})` }}
      </span>
    </template>
    <template #content>
      <v-divider />
      <selectable-customer-groups
        v-model="taxonomy"
        :grid-options="customerGroupOptions"
        show-chips
        multiple
        class="ma-4"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableCustomerGroups from '@/components/common/selectables/resources/SelectableCustomerGroups.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyCustomerGroup',

  components: { ExpandableContent, SelectableCustomerGroups },

  props: {
    value: {
      type: Object as PropType<Taxonomy>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const taxonomy = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const customerGroupOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return { headers }
    })

    return {
      taxonomy,
      customerGroupOptions
    }
  }
})
</script>
