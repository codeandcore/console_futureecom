<template>
  <div class="d-flex flex-column flex-gap-32">
    <page-type v-model="page" :disabled="!!value.id" />

    <translation-tabs :translatable-values="['name', 'content']">
      <template #default.name>
        <page-name v-model="page" :rules="rules.name" class="required" />
        <page-content v-model="page" :rules="rules.content" class="d-flex flex-column flex-gap-8 mt-4 required" />
      </template>
      <template #name="{ code }">
        <page-name v-model="page" :translation-code="code" />
        <page-translation-content v-model="page" :translation-code="code" class="d-flex flex-column flex-gap-8 mt-4" />
      </template>
    </translation-tabs>

    <page-slug
      v-model="page"
      :disabled="value.protected"
      :messages="value.protected ? $t('Page is protected') : ''"
      :rules="rules.slug"
      class="required"
    />

    <page-scripts v-model="page" />
    <page-available-variables :value="page" />
    <page-customer-group v-if="hasAccessToCustomerGroup" v-model="page" class="mt-8" />
    <readonly-card v-else>
      <span>{{ $t('Customer Group Code') }}:</span>
      <span>{{ value.customer_group }}</span>
    </readonly-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import NameInput from '@/components/foundation/NameInput.vue'
import PageAvailableVariables from './pages/PageAvailableVariables.vue'
import PageContent from '@/components/domains/cms/pages/PageContent.vue'
import PageCustomerGroup from '@/components/domains/cms/pages/PageCustomerGroup.vue'
import PageScripts from '@/components/domains/cms/pages/PageScripts.vue'
import PageTranslationContent from '@/components/domains/cms/pages/translations/PageTranslationContent.vue'
import SlugInput from '@/components/foundation/SlugInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import TypeInput from '@/components/domains/cms/TypeInput.vue'
import type { Page } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'PageInputs',
  components: {
    PageTranslationContent,
    TranslationTabs,
    PageContent,
    PageScripts,
    PageCustomerGroup,
    PageAvailableVariables,
    PageSlug: SlugInput,
    PageName: NameInput,
    PageType: TypeInput
  },
  props: {
    value: {
      type: Object as PropType<Page>,
      required: true
    }
  },

  setup(props, { emit }) {
    const page = computed({
      get: () => props.value,
      set: (page) => emit('input', page)
    })

    const rules = {
      name: [(name: string): ValidationRule => useNotEmptyValidationRule(name)],
      slug: [(slug: string): ValidationRule => useNotEmptyValidationRule(slug)],
      content: [(content: string): ValidationRule => useNotEmptyValidationRule(content)]
    }

    const hasAccessToCustomerGroup = computed((ctx) => {
      return ctx.$canAny('read,customers\\group', 'manage,customers\\group').value
    })

    return {
      page,
      rules,
      hasAccessToCustomerGroup
    }
  }
})
</script>
