<template>
  <div class="d-flex flex-column">
    <clear-translation-warning
      v-if="translated"
      :show-alert="translationPartiallyFilled"
      @onClearClick="clearTranslations"
    />

    <div class="d-flex">
      <v-text-field
        v-model="form.name"
        :rules="dynamicRules[rulesMode].name"
        :label="$t('Name')"
        outlined
        class="me-2"
      />
      <v-text-field
        v-model="form.value"
        :rules="dynamicRules[rulesMode].value"
        :label="$t('Value')"
        outlined
        class="ms-2"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import ClearTranslationWarning from '@/components/common/ClearTranslationWarning.vue'
import type { ProductProperty } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationRule } from '@/composable/validationRules'

interface PropertyRules {
  name: ((value: string) => ValidationRule)[]
  value: ((value: string) => ValidationRule)[]
}

interface PropertyInputRules {
  full: PropertyRules
  none: PropertyRules
}

export default defineComponent({
  name: 'ProductPropertyInput',
  components: { ClearTranslationWarning },
  props: {
    value: {
      type: Object as () => ProductProperty,
      required: true
    },
    translated: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const form = ref<ProductProperty>({ ...props.value })

    const translationPartiallyFilled = computed(() => {
      const fullyFilled = Boolean(!!form.value.name && !!form.value.value)
      const noneFilled = Boolean(!form.value.name && !form.value.value)
      return !(fullyFilled || noneFilled)
    })

    const clearTranslations = () => {
      form.value = {
        name: '',
        value: '',
        key: form.value.key
      }
    }

    const rulesMode = ref<'full' | 'none'>(props.translated ? 'none' : 'full')
    const dynamicRules = ref<PropertyInputRules>({
      full: {
        name: [(): ValidationRule => useNotEmptyValidationRule(form.value.name)],
        value: [(): ValidationRule => useNotEmptyValidationRule(form.value.value)]
      },
      none: {
        name: [(): ValidationRule => true],
        value: [(): ValidationRule => true]
      }
    })

    watch(form, () => emit('input', { ...form.value }), { deep: true })

    return {
      form,
      dynamicRules,
      rulesMode,
      translationPartiallyFilled,
      clearTranslations
    }
  }
})
</script>
