<template>
  <div>
    <territory-country-code v-model="territory" class="required" :rules="rules.country_code" />
    <territory-administrative-area v-model="territory" :hint="regionHint" />
    <territory-locality v-model="territory" />
    <territory-dependent-locality v-model="territory" />
    <territory-included-postal-codes v-model="territory" />
    <territory-excluded-postal-codes v-model="territory" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import TerritoryAdministrativeArea from '@/components/domains/zones/territories/TerritoryAdministrativeArea.vue'
import TerritoryCountryCode from '@/components/domains/zones/territories/TerritoryCountryCode.vue'
import TerritoryDependentLocality from '@/components/domains/zones/territories/TerritoryDependentLocality.vue'
import TerritoryExcludedPostalCodes from '@/components/domains/zones/territories/TerritoryExcludedPostalCodes.vue'
import TerritoryIncludedPostalCodes from '@/components/domains/zones/territories/TerritoryIncludedPostalCodes.vue'
import TerritoryLocality from '@/components/domains/zones/territories/TerritoryLocality.vue'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'TerritoryInputs',

  components: {
    TerritoryExcludedPostalCodes,
    TerritoryIncludedPostalCodes,
    TerritoryDependentLocality,
    TerritoryLocality,
    TerritoryAdministrativeArea,
    TerritoryCountryCode
  },

  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const territory = computed({
      get: () => props.value,
      set: (territory) => emit('input', territory)
    })

    const regionHint = computed(() => (!props.value.country_code ? root.$t('Select country first') : ''))

    const rules = {
      country_code: [(country_code: string): ValidationRule => useNotEmptyValidationRule(country_code)]
    }

    return {
      territory,
      rules,
      regionHint
    }
  }
})
</script>
