<template>
  <div>
    <h4>{{ $t('PoS') }}</h4>

    <div class="d-flex justify-space-between">
      <date-format-preview :value="pos" />
      <v-icon class="pointer" @click="pos = null">replay</v-icon>
    </div>

    <date-format-inputs v-bind="$attrs" v-model="pos" :label="$t('PoS')" class="d-flex flex-gap-16" />
    <rule-validator v-if="pos" :value="pos" :rules="rules" />
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
  name: 'GeneralSettingsDateFormatPos',
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
    const pos = computed({
      get: () => (Array.isArray(props.value.pos) || props.value.pos === null ? null : props.value.pos),
      set: (pos) => emit('input', { ...props.value, pos })
    })

    return {
      pos
    }
  }
})
</script>
