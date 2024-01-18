<template>
  <expandable-content outlined>
    <template #title>
      <span>
        {{ $t('Allowed Groups') }}
        {{ (category.customer_group || []).length ? `(${category.customer_group.length})` : `(${$t('all')})` }}
      </span>
    </template>
    <template #content>
      <v-divider />
      <selectable-customer-groups
        v-model="category"
        :grid-options="customerGroupOptions"
        show-chips
        multiple
        class="ma-4"
      >
        <template #item.name="{ item }">
          <router-link :to="{ name: 'customer-group-update', params: { id: item.id } }">
            {{ item.name }}
          </router-link>
        </template>
      </selectable-customer-groups>
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableCustomerGroups from '@/components/common/selectables/resources/SelectableCustomerGroups.vue'
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CategoryCustomerGroup',
  components: { SelectableCustomerGroups, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Partial<Category>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const category = computed({
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
      category,
      customerGroupOptions
    }
  }
})
</script>
