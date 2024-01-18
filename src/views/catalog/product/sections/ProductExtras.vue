<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <span>{{ $t('Extras') }}</span>
      <v-btn depressed color="primary" @click="addExtras">
        {{ $t('Add extras') }}
      </v-btn>
    </div>

    <translation-tabs v-if="(val.extras || []).length" :translatable-values="['extras']" class="px-0 mx-0 mt-4">
      <template #default.extras="{ code }">
        <div v-for="(extras, index) in val.extras" :key="`default-${extras.key}`">
          <expandable-content eager>
            <template #title>
              <product-extra-expansion-tile :extras="extras" />
            </template>
            <template #after-icon>
              <v-btn icon @click="deleteExtras(index)">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template #content>
              <product-extras-input
                :key="`extras-${index}`"
                :value="extras"
                class="mx-4 my-4"
                :breadcrumb-error-code="`extras-${code}-${index}`"
                @input="updateExtras($event, index)"
              />
            </template>
          </expandable-content>
        </div>
      </template>
      <template #extras="{ code }">
        <div v-for="(extras, index) in translations(code).get()" :key="`${extras.key}-${code}`">
          <expandable-content eager>
            <template #title>
              <product-extra-expansion-tile :extras="extras" />
            </template>
            <template #content>
              <product-extras-input
                :key="`extras-${index}`"
                :value="extras"
                translated
                :source-options="val.extras[index].options"
                class="mx-4 my-4"
                :breadcrumb-error-code="`extras-${code}-${index}`"
                @input="updateExtrasTranslation($event, code, index)"
              />
            </template>
          </expandable-content>
        </div>
      </template>
    </translation-tabs>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash-es'
import { defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import { v4 as uuidv4 } from 'uuid'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import ProductExtraExpansionTile from '@/components/domains/products/ProductExtraExpansionTile.vue'
import ProductExtrasInput from '@/components/domains/products/inputs/ProductExtrasInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import dotProp from 'dot-prop'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Product, ProductTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductExtras } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { Translations } from '@futureecom/futureecom-js/dist/futureecom'

export default defineComponent({
  name: 'ProductExtras',
  components: {
    ProductExtraExpansionTile,
    ExpandableContent,
    TranslationTabs,
    ProductExtrasInput
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const val = reactive({
      extras: props.value.extras
    })

    const tExtras = ref<Translations<ProductTranslations>>({ ...props.value.translations })

    watch(val, () => emit('input', { ...props.value, ...val }))

    const template = (id?: string): ProductExtras => {
      const generateKey = () => id || uuidv4().toString()
      return {
        key: generateKey(),
        name: '',
        options: structuredClone([{ key: generateKey(), value: '' }]),
        limit: 0
      }
    }

    const { forEachLanguage } = useTranslationCleanup()

    const refillExtrasTranslations = () => {
      const defaultValue = (val.extras || []).map((extras) => ({
        key: extras.key,
        name: '',
        options: extras.options.map((option) => ({ key: option.key, value: '' }))
      }))
      forEachLanguage((lang: Language) => {
        if (translations(lang.code).get().length) {
          return
        }
        translations(lang.code).set(defaultValue)
      })
    }

    const addExtras = () => {
      const extras = template()
      val.extras = [extras, ...(val.extras || [])]
      forEachLanguage((lang: Language) => {
        const translatedExtras = translations(lang.code).get()
        const { key, name, options } = cloneDeep(extras)
        translations(lang.code).set([{ key, name, options }, ...translatedExtras])
      })
    }

    const deleteExtras = (index: number) => {
      val.extras = (val.extras || [])?.filter((item, itemIndex) => itemIndex !== index)
      forEachLanguage((lang: Language) => {
        const translatedExtras = translations(lang.code).get()
        const filtered = translatedExtras.filter((item, itemIndex) => itemIndex !== index)
        translations(lang.code).set(filtered)
      })
    }

    const updateExtras = (extras: ProductExtras, index: number) => {
      if (val.extras) {
        val.extras[index] = extras
        val.extras = [...val.extras]
      }
    }

    const updateExtrasTranslation = (extras: ProductExtras, code: string, index: number) => {
      const translatedExtras = translations(code).get() as ProductExtras[]
      if (translatedExtras) {
        translatedExtras[index] = extras
        translations(code).set(translatedExtras)
      }
    }

    const translations = (code: string) => ({
      get: () => dotProp.get(tExtras.value, `${code}.extras`, []),
      set: (value: any) => {
        tExtras.value = { ...dotProp.set(tExtras.value, `${code}.extras`, value || undefined) }
        emit('onTranslationUpdate', { code, value: { extras: value } })
      }
    })

    refillExtrasTranslations()

    return {
      val,
      addExtras,
      deleteExtras,
      updateExtras,
      translations,
      updateExtrasTranslation
    }
  }
})
</script>
