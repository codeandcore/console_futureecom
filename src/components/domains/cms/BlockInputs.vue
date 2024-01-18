<template>
  <div class="d-flex flex-column flex-gap-16">
    <div class="d-flex flex-gap-16">
      <block-name v-model="block" :disabled="!!value.id" :rules="rules.name" class="required" />
      <block-code v-model="block" :disabled="!!value.id" :rules="rules.code" class="required" />
    </div>
    <block-type v-model="block" :disabled="!!value.id" />
    <translation-tabs :translatable-values="['content']">
      <template #default.content>
        <block-content v-model="block" :rules="rules.content" class="d-flex flex-column flex-gap-8 mt-4 required" />
      </template>
      <template #content="{ code }">
        <block-translation-content v-model="block" :translation-code="code" />
      </template>
    </translation-tabs>
  </div>
</template>

<script lang="ts">
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import BlockContent from '@/components/domains/cms/blocks/BlockContent.vue'
import BlockTranslationContent from '@/components/domains/cms/blocks/translations/BlockTranslationContent.vue'
import CodeInput from '@/components/foundation/CodeInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import TypeInput from '@/components/domains/cms/TypeInput.vue'
import type { Block } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'BlockInputs',

  components: {
    BlockTranslationContent,
    TranslationTabs,
    BlockContent,
    BlockName: NameInput,
    BlockCode: CodeInput,
    BlockType: TypeInput
  },

  props: {
    value: {
      type: Object as PropType<Block>,
      required: true
    }
  },

  setup(props, { emit }) {
    const block = computed({
      get: () => props.value,
      set: (block) => emit('input', block)
    })

    const rules = {
      name: [(name: string): ValidationRule => useNotEmptyValidationRule(name)],
      code: [(code: string): ValidationRule => useNotEmptyValidationRule(code)],
      content: [(content: string): ValidationRule => useNotEmptyValidationRule(content)]
    }

    return {
      block,
      rules
    }
  }
})
</script>
