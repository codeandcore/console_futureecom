<template>
  <div class="d-flex flex-column">
    <v-alert type="warning" class="text-caption" dismissible transition="fade-transition">
      {{ $t('Consider making a copy of the template before installation as it will replace your current template.') }}
    </v-alert>

    <select-preset :rules="rules" @input="presetId = $event" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import SelectPreset from '@/components/common/selectables/SelectPreset.vue'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'PresetInstallInputs',

  components: { SelectPreset },

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const presetId = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = [(): ValidationRule => useNotEmptyValidationRule(presetId.value)]

    return {
      rules,
      presetId
    }
  }
})
</script>
