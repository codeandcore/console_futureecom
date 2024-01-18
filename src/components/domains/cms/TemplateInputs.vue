<template>
  <div class="d-flex flex-column flex-gap-16">
    <template-name v-model="template" :rules="rules.name" />
    <template-code v-model="template" :rules="rules.code" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import CodeInput from '@/components/foundation/CodeInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import type { CreateNewTemplate } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'TemplateInputs',
  components: { TemplateName: NameInput, TemplateCode: CodeInput },
  props: {
    value: {
      type: Object as PropType<CreateNewTemplate>,
      required: true
    }
  },

  setup(props, { emit }) {
    const template = computed({
      get: () => props.value,
      set: (template) => emit('input', template)
    })

    const rules = {
      name: [(name: string): ValidationRule => useNotEmptyValidationRule(name)],
      code: [(code: string): ValidationRule => useNotEmptyValidationRule(code)]
    }

    return {
      template,
      rules
    }
  }
})
</script>
