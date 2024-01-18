<template>
  <div>
    <clear-translation-warning
      v-if="translated"
      :show-alert="translationPartiallyFilled"
      @onClearClick="clearTranslations"
    />

    <div class="my-4">
      <v-text-field v-model="form.name" :label="$t('Name')" outlined :rules="dynamicRules[rulesMode].name" />
      <v-text-field
        v-model.number="form.limit"
        :label="$t('Limit')"
        :disabled="translated"
        outlined
        :rules="dynamicRules[rulesMode].limit"
      />
    </div>
    <div class="d-flex align-center justify-space-between">
      <span>{{ $t('Options') }}:</span>
      <v-btn v-if="!translated" depressed fab x-small color="primary" @click="addOption">
        <v-icon>add</v-icon>
      </v-btn>
    </div>
    <div v-for="(option, index) in form.options" :key="option.key">
      <div class="d-flex align-center">
        <v-text-field
          :value="option.value"
          :label="$t('Option')"
          hide-details="auto"
          outlined
          class="my-4"
          :rules="dynamicRules[rulesMode].optionValue"
          @input="updateOption($event, index)"
        />
        <v-btn
          v-if="!translated && form.options.length > 1"
          depressed
          fab
          x-small
          color="secondary"
          class="ms-4"
          @click="deleteOption(index)"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { useNotEmptyArrayValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import { v4 as uuidv4 } from 'uuid'
import ClearTranslationWarning from '@/components/common/ClearTranslationWarning.vue'
import type { ProductExtraOptions, ProductExtras } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ValidationRule } from '@/composable/validationRules'

interface ExtrasRules {
  name: ((value: string) => ValidationRule)[]
  limit: ((value: string) => ValidationRule)[]
  options: (() => ValidationRule)[]
  optionValue: ((value: string) => ValidationRule)[]
}

interface ExtrasInputRules {
  full: ExtrasRules
  none: ExtrasRules
}

export default defineComponent({
  name: 'ProductExtrasInput',
  components: { ClearTranslationWarning },
  props: {
    value: {
      type: Object as () => ProductExtras,
      required: true
    },
    translated: {
      type: Boolean,
      default: false
    },
    sourceOptions: {
      type: Array as () => ProductExtraOptions[],
      default: () => []
    }
  },

  setup(props, { emit }) {
    const optionTemplate = (id?: string): ProductExtraOptions => ({
      key: id || uuidv4().toString(),
      value: ''
    })

    const form = ref<ProductExtras>({ ...props.value })

    const translationPartiallyFilled = computed(() => {
      const hasOptionsFilled = form.value.options.some((item) => !!item.value)
      const hasNameFilled = !!form.value.name

      return hasOptionsFilled || hasNameFilled
    })

    const clearTranslations = () => {
      form.value = {
        name: '',
        limit: 0,
        options: form.value.options.map(({ key }) => ({ key, value: '' })),
        key: form.value.key
      }
    }

    const rulesMode = ref<'full' | 'none'>(props.translated ? 'none' : 'full')
    const dynamicRules = ref<ExtrasInputRules>({
      full: {
        name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
        limit: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
        options: [(): ValidationRule => useNotEmptyArrayValidationRule(form.value.options)],
        optionValue: [(value: string): ValidationRule => useNotEmptyValidationRule(value)]
      },
      none: {
        name: [(): ValidationRule => true],
        limit: [(): ValidationRule => true],
        options: [(): ValidationRule => true],
        optionValue: [(): ValidationRule => true]
      }
    })

    const addOption = (): void => {
      const template = optionTemplate()
      form.value.options = [...form.value.options, { ...template }]
    }
    const updateOption = (value: string, index: number): void => {
      form.value.options[index].value = value
      form.value.options = [...form.value.options]
    }
    const deleteOption = (index: number): void => {
      form.value.options = form.value.options.filter((option, optionIndex) => optionIndex !== index)
    }

    const remapOptions = (newValue: ProductExtraOptions[]) => {
      if (!props.translated) {
        return
      }

      if (props.sourceOptions.length === form.value.options.length) {
        return
      }

      //add or remove option keys based on sourced options change
      const options = newValue.reduce((previous: ProductExtraOptions[], currentSource) => {
        const foundOption = form.value.options.find((option) => option.key === currentSource.key)
        previous = [...previous, { ...(foundOption || currentSource) }]
        return previous
      }, [])

      form.value.options = options
    }

    if (props.translated) {
      watch(
        () => props.sourceOptions,
        (newValue) => remapOptions(newValue),
        { immediate: true }
      )
    }

    watch(form, () => emit('input', { ...form.value }), { deep: true })

    return {
      form,
      dynamicRules,
      rulesMode,
      clearTranslations,
      translationPartiallyFilled,
      updateOption,
      addOption,
      deleteOption
    }
  }
})
</script>
