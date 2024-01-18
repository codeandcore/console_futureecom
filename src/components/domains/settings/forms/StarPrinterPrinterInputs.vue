<template>
  <div>
    <v-text-field
      :value="value.name"
      :label="$t('Name')"
      outlined
      :rules="rules.name"
      @input="$emit('input', { ...value, name: $event })"
    />
    <v-text-field
      :value="value.mac"
      :label="$t('MAC Address')"
      :rules="rules.mac"
      outlined
      @input="$emit('input', { ...value, mac: $event })"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

interface StarPrinter {
  name: string
  mac: string
}

export default defineComponent({
  name: 'PluginStarPrinterPrintersList',

  props: {
    value: {
      type: Object as PropType<StarPrinter>
    }
  },

  setup() {
    const { t } = useI18n()

    const rules = {
      name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      mac: [
        (val: string): ValidationRule => {
          if (/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i.test(val)) {
            return true
          }

          return t('Invalid MAC address')
        }
      ]
    }

    return {
      rules
    }
  }
})
</script>
