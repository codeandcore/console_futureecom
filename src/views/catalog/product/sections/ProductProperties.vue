<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <span>{{ $t('Properties') }}</span>
      <v-btn depressed color="primary" @click="addProperty">
        {{ $t('Add property') }}
      </v-btn>
    </div>

    <translation-tabs v-if="(val.properties || []).length" :translatable-values="['properties']" class="px-0 mx-0 mt-4">
      <template #default.properties>
        <div v-for="(property, index) in val.properties" :key="`default-${property.key}`">
          <expandable-content eager>
            <template #title>
              <div class="d-flex flex-column grey--text text-caption">
                <span>{{ 'Name' }}: {{ property.name || 'N/A' }}</span>
                <span>{{ 'Value' }}: {{ property.value || 'N/A' }}</span>
              </div>
            </template>
            <template #after-icon>
              <v-btn icon @click="deleteProperty(index)">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template #content>
              <product-property-input
                :key="`properties-${index}`"
                :value="property"
                class="mx-4 my-4"
                @input="updateProperty($event, index)"
              />
            </template>
          </expandable-content>
        </div>
      </template>
      <template #properties="{ code }">
        <div v-for="(property, index) in translations(code).get()" :key="`${property.key}-${code}`">
          <expandable-content eager>
            <template #title>
              <div class="d-flex flex-column grey--text text-caption">
                <span>{{ 'Name' }}: {{ property.name || 'N/A' }}</span>
                <span>{{ 'Value' }}: {{ property.value || 'N/A' }}</span>
              </div>
            </template>
            <template #content>
              <product-property-input
                :key="`property-${index}`"
                :value="property"
                translated
                class="mx-4 my-4"
                @input="updatePropertyTranslation($event, code, index)"
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
import ProductPropertyInput from '@/components/domains/products/inputs/ProductPropertyInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import dotProp from 'dot-prop'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Product, ProductProperty } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { Translations } from '@futureecom/futureecom-js/dist/futureecom'

export default defineComponent({
  name: 'ProductProperties',
  components: {
    ProductPropertyInput,
    ExpandableContent,
    TranslationTabs
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const val = reactive({
      properties: props.value.properties
    })

    const tProperties = ref<Translations<ProductTranslations>>({ ...props.value.translations })

    watch(val, () => emit('input', { ...props.value, ...val }))

    const template = (id?: string): ProductProperty => {
      const generateKey = () => id || uuidv4().toString()
      return {
        key: generateKey(),
        name: '',
        value: ''
      }
    }

    const { forEachLanguage } = useTranslationCleanup()

    const refillPropertyTranslations = () => {
      const defaultValue = (val.properties || []).map((property: ProductProperty) => ({
        key: property.key,
        name: '',
        value: ''
      }))
      forEachLanguage((lang: Language) => {
        if (translations(lang.code).get().length) {
          return
        }
        translations(lang.code).set(defaultValue)
      })
    }

    const addProperty = () => {
      const property = template()
      val.properties = [property, ...(val.properties || [])]
      forEachLanguage((lang: Language) => {
        const translatedProperty = translations(lang.code).get()
        const { key, name, value } = cloneDeep(property)
        translations(lang.code).set([{ key, name, value }, ...translatedProperty])
      })
    }

    const deleteProperty = (index: number) => {
      val.properties = (val.properties || [])?.filter((item: ProductProperty, itemIndex: number) => itemIndex !== index)
      forEachLanguage((lang: Language) => {
        const translatedProperty = translations(lang.code).get()
        const filtered = translatedProperty.filter((item, itemIndex) => itemIndex !== index)
        translations(lang.code).set(filtered)
      })
    }

    const updateProperty = (property: ProductProperty, index: number) => {
      if (val.properties) {
        val.properties[index] = property
        val.properties = [...val.properties]
      }
    }

    const updatePropertyTranslation = (property: ProductProperty, code: string, index: number) => {
      const translatedProperty = translations(code).get() as ProductProperty[]
      if (translatedProperty) {
        translatedProperty[index] = property
        translations(code).set(translatedProperty)
      }
    }

    const translations = (code: string) => ({
      get: () => dotProp.get(tProperties.value, `${code}.properties`, []),
      set: (value: any) => {
        tProperties.value = { ...dotProp.set(tProperties.value, `${code}.properties`, value || undefined) }
        emit('onTranslationUpdate', { code, value: { properties: value } })
      }
    })

    refillPropertyTranslations()

    return {
      val,
      translations,
      addProperty,
      deleteProperty,
      updateProperty,
      updatePropertyTranslation
    }
  }
})
</script>
