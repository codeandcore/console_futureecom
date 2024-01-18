<template>
  <div>
    <zone-label v-model="zone" class="required" :rules="rules.label" />
    <zone-code v-model="zone" :disabled="zone.id" class="required" :rules="rules.code" />
    <zone-territories v-model="zone" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import ZoneCode from '@/components/domains/zones/zone/ZoneCode.vue'
import ZoneLabel from '@/components/domains/zones/zone/ZoneLabel.vue'
import ZoneTerritories from '@/components/domains/zones/zone/ZoneTerritories.vue'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'
import type { Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'ZoneInputs',

  components: {
    ZoneTerritories,
    ZoneCode,
    ZoneLabel
  },

  props: {
    value: {
      type: Object as PropType<Zone>,
      required: true
    }
  },

  setup(props, { emit }) {
    const zone = computed({
      get: (): Zone => props.value,
      set: (zone: Zone) => emit('input', zone)
    })

    const rules = {
      label: [(label: string): ValidationRule => useNotEmptyValidationRule(label)],
      code: [(code: string): ValidationRule => useNotEmptyValidationRule(code)]
    }

    return {
      zone,
      rules
    }
  }
})
</script>
