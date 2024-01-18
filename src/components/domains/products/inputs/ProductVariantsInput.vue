<template>
  <div class="d-flex flex-column">
    <clear-translation-warning
      v-if="!!source"
      :show-alert="translationPartiallyFilled"
      @onClearClick="clearTranslations"
    />

    <v-text-field
      v-model="form.name"
      :rules="dynamicRules[rulesMode].name"
      :label="$t('Name')"
      outlined
      hide-details="auto"
    />
    <span v-if="!!source" class="grey--text text-caption mt-2">{{ $t('Translation for') }}: {{ source.name }}</span>

    <span class="mt-4">{{ $t('Options') }}:</span>

    <v-combobox
      v-model="form.options"
      chips
      multiple
      deletable-chips
      :rules="dynamicRules[rulesMode].option"
      outlined
      class="mt-4"
      :label="$t('Options')"
      hide-details="auto"
    />
    <template v-if="source && source.options.length">
      <div class="grey--text text-caption mt-2">
        <span>{{ $t('Translation for') }}:</span>
        <span v-for="(sourceOption, index) in source.options || []" :key="`source-option-${index}`">
          {{ sourceOption }}
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { useNotEmptyArrayValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import ClearTranslationWarning from '@/components/common/ClearTranslationWarning.vue'
import type { ProductVariant } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

interface VariantRules {
  name: (() => ValidationRule)[]
  options: (() => ValidationRule)[]
}

interface VariantInputRules {
  full: VariantRules
  none: VariantRules
}

export default defineComponent({
  name: 'ProductVariantsInput',
  components: { ClearTranslationWarning },
  props: {
    value: {
      type: Object as () => ProductVariant,
      required: true
    },
    source: {
      type: Object as PropType<ProductVariant>,
      default: () => undefined
    }
  },

  setup(props, { emit }) {
    const form = ref<ProductVariant>({ ...props.value })

    const rulesMode = ref<'full' | 'none'>(props.source ? 'none' : 'full')
    const dynamicRules = ref<VariantInputRules>({
      full: {
        name: [(): ValidationRule => useNotEmptyValidationRule(form.value.name)],
        options: [(): ValidationRule => useNotEmptyArrayValidationRule(form.value.options)]
      },
      none: {
        name: [(): ValidationRule => true],
        options: [(): ValidationRule => true]
      }
    })

    const translationPartiallyFilled = computed(() => {
      const hasOptionsFilled = form.value.options.length === props.source?.options.length
      return !hasOptionsFilled || !form.value.name
    })

    const clearTranslations = (): void => {
      form.value.name = ''
      form.value.options = []
    }

    watch(form, () => emit('input', { ...form.value }), { deep: true })

    return {
      form,
      rulesMode,
      dynamicRules,
      translationPartiallyFilled,
      clearTranslations
    }
  }
})
</script>
