<template>
  <div class="d-flex flex-column">
    <translation-tabs :translatable-values="['description']" class="px-0 mx-0 mt-4">
      <template #default.description>
        <translatable-descriptions
          :key="descriptionsLength"
          :items="val.description || []"
          :headers="headers"
          @onChange="val.description = $event"
          @onDeletedKey="onDeletedKey"
        />
      </template>
      <template #description="{ code }">
        <translatable-descriptions
          :key="`${descriptionsLength}`"
          :items="translations(`${code}.description`).value"
          :headers="translatedHeaders"
          :translation-source="val.description || []"
          @onChange="translations(`${code}.description`).value = $event"
        />
      </template>
    </translation-tabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from '@vue/composition-api'
import { reactiveProp } from '@/composable/useReactiveProp'
import { useI18n } from 'vue-i18n-bridge'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import TranslatableDescriptions from '@/components/domains/products/translatables/TranslatableDescriptions.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { Product, ProductDescription } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductDescription',
  components: {
    TranslatableDescriptions,
    TranslationTabs
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const val = reactive({ description: props.value.description || [] })

    const descriptionsLength = computed(() => val.description.length)

    //@ts-expect-error
    const translations = reactiveProp<ProductDescription[]>(props.value.translations, (updated) => {
      if (!updated) {
        return
      }
      const [code, value] = Object.entries(updated)[0]
      emit('onTranslationUpdate', { code, value })
    })

    const headers = computed(() => {
      return [
        { text: t('Title'), value: 'title' },
        { text: t('Actions'), value: 'data-table-expand' }
      ]
    })

    const translatedHeaders = computed(() => {
      return [{ text: t('Source Title'), value: 'source' }, ...headers.value]
    })

    watch(val, () => emit('input', { ...props.value, ...val }))

    const { forEachLanguage } = useTranslationCleanup()

    const filterDescriptions = (items: ProductDescription[], key: string) => {
      return items.filter((description) => description.key !== key)
    }

    const onDeletedKey = (key: string): void => {
      forEachLanguage((lang) => {
        const descriptions = translations(`${lang.code}.description`).value
        if ((descriptions || []).length) {
          translations(`${lang.code}.description`).value = filterDescriptions(descriptions, key)
        }
      })
    }

    return {
      val,
      headers,
      translations,
      onDeletedKey,
      descriptionsLength,
      translatedHeaders
    }
  }
})
</script>
