<template>
  <div class="d-flex flex-column flex-gap-16">
    <v-text-field v-model="item.title" :label="$t('Title')" outlined :rules="rules.title" />
    <html-editor v-model="item.content" :label="$t('Content')">
      <template #error>
        <rule-validator :value="item.content" :rules="rules.content" />
      </template>
    </html-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import HtmlEditor from '@/components/common/HtmlEditor.vue'
import RuleValidator from '@/components/common/RuleValidator.vue'
import type { ProductDescription } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'ProductDescriptionInput',

  components: { RuleValidator, HtmlEditor },
  props: {
    value: {
      type: Object as () => ProductDescription,
      required: true
    }
  },

  setup(props, { emit }) {
    const item = ref<ProductDescription>({ ...props.value })

    const rules = {
      title: [(val: string) => useNotEmptyValidationRule(val)],
      content: [(val: string) => useNotEmptyValidationRule(val)]
    }

    watch(item, () => emit('input', { ...item.value }), { deep: true })

    return {
      item,
      rules
    }
  }
})
</script>
