<template>
  <select-taxonomy v-bind="$attrs" v-model="taxonomy" @input="onSelect" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import SelectTaxonomy from '@/components/common/selectables/SelectTaxonomy.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'SaleTaxGroupTaxonomy',

  components: { SelectTaxonomy },

  props: {
    value: {
      type: Object as PropType<TaxRateGroup>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()

    const taxonomy = ref<Taxonomy>()

    if (props.value.taxonomy) {
      api.catalog
        .taxonomies({ filter: { code: props.value.taxonomy } })
        .then((val) => (taxonomy.value = val.data[0]))
        .catch(() => addErrorToast(t('Unable to fetch taxonomy')))
    }

    const taxonomyCode = computed({
      get: () => props.value.taxonomy,
      set: (taxonomy) => emit('input', { ...props.value, taxonomy })
    })

    const onSelect = (val?: Taxonomy) => (taxonomyCode.value = val?.code || null)

    return {
      onSelect,
      taxonomy
    }
  }
})
</script>
