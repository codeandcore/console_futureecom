<template>
  <div>
    <h4>{{ $t('Console') }}</h4>

    <div class="d-flex justify-space-between">
      <date-format-preview :value="console" />
      <v-icon class="pointer" @click="console = null">replay</v-icon>
    </div>

    <date-format-inputs v-bind="$attrs" v-model="console" :label="$t('Console')" class="d-flex flex-gap-16" />
    <rule-validator v-if="console" :value="console" :rules="rules" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import DateFormatInputs from '@/components/domains/settings/forms/DateFormatInputs.vue'
import DateFormatPreview from '@/components/domains/settings/general/DateFormat/DateFormatPreview.vue'
import RuleValidator from '@/components/common/RuleValidator.vue'
import type {
  DateTimeFormat,
  GeneralSettingsDateFormatResponse
} from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingsDateFormatConsole',

  components: { RuleValidator, DateFormatPreview, DateFormatInputs },
  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<GeneralSettingsDateFormatResponse>,
      required: true
    },
    rules: {
      type: Array as PropType<((value: DateTimeFormat) => ValidationRule)[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const console = computed({
      get: () => (Array.isArray(props.value.console) || props.value.console === null ? null : props.value.console),
      set: (console) => emit('input', { ...props.value, console })
    })

    return {
      console
    }
  }
})
</script>
