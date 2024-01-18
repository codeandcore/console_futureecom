<template>
  <div>
    <subresource-expansion-panel v-if="!translationSource || missingTranslations.length" :can-create="true">
      <template #header>
        <span>{{ !translationSource ? $t('Add description') : $t('Add translation') }}</span>
      </template>
      <template #content>
        <form-validator-wrapper :key="descriptionTableSize" class="mt-4" @submit="addItem">
          <template #default="{ valid }">
            <v-select
              v-if="!!translationSource && missingTranslations.length"
              v-model="newDescriptionTab.key"
              :items="missingTranslations"
              item-text="title"
              item-value="key"
              outlined
              :label="$t('Select description to translate')"
              :rules="rules"
            />
            <product-description-input v-if="newDescriptionTab.key" v-model="newDescriptionTab" />
            <div class="d-flex justify-end mt-4">
              <v-btn :disabled="!valid" depressed color="primary" type="submit">
                {{ $t('Submit') }}
              </v-btn>
            </div>
          </template>
        </form-validator-wrapper>
      </template>
    </subresource-expansion-panel>
    <v-alert v-else type="info" dismissible>
      <span>{{ $t('Every description is translated :)') }}</span>
    </v-alert>
    <v-data-table
      show-expand
      single-expand
      :items="translationSource ? translatedDescriptions : form"
      :headers="headers"
      hide-default-footer
      item-key="key"
      class="v-data-table-shadowless"
      @item-expanded="onExpand"
    >
      <template #expanded-item="{ headers, item }">
        <td :key="item.key" :colspan="headers.length" class="py-6">
          <form-validator-wrapper v-if="expandedDescriptionTab" @submit="updateItem(item.key, expandedDescriptionTab)">
            <template #default="{ valid }">
              <product-description-input v-model="expandedDescriptionTab" />
              <div class="d-flex justify-space-between mt-4">
                <v-btn depressed @click="onDelete(item.key)">
                  {{ $t('Delete') }}
                </v-btn>
                <v-btn :disabled="!valid" depressed color="primary" type="submit">
                  {{ $t('Update') }}
                </v-btn>
              </div>
            </template>
          </form-validator-wrapper>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { v4 as uuidv4 } from 'uuid'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ProductDescriptionInput from '@/components/domains/products/inputs/ProductDescriptionInput.vue'
import SubresourceExpansionPanel from '@/components/tables/subresources/SubresourceExpansionPanel.vue'
import type { GridHeader } from '@/types/DataTableGrid'
import type { ProductDescription } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

interface TranslatedDescription extends ProductDescription {
  source: string
}

export default defineComponent({
  name: 'TranslatableDescriptions',
  components: { SubresourceExpansionPanel, ProductDescriptionInput, FormValidatorWrapper },
  props: {
    items: {
      type: Array as PropType<ProductDescription[]>,
      default: () => []
    },
    translationSource: {
      type: Array as PropType<ProductDescription[]>,
      default: () => undefined
    },
    headers: {
      type: Array as PropType<GridHeader[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const form = ref<ProductDescription[]>(structuredClone(props.items || []))
    const descriptionTableSize = computed(() => form.value.length)

    const descriptionTemplate = (id?: string): ProductDescription => ({
      key: id || !props.translationSource ? uuidv4().toString() : '',
      title: '',
      content: ''
    })

    const newDescriptionTab = ref<ProductDescription>(descriptionTemplate())
    const expandedDescriptionTab = ref<ProductDescription>()
    const missingTranslations = computed(() => {
      if (!props.translationSource) {
        return []
      }
      const translatedKeys = form.value.map((item) => item.key)
      return props.translationSource.filter((item) => !translatedKeys.includes(item.key))
    })

    const translatedDescriptions = computed((): TranslatedDescription[] => {
      return form.value.reduce((previous: TranslatedDescription[], current) => {
        const source = (props.translationSource || []).find((source) => source.key === current.key)
        return source ? [{ ...current, source: source.title }] : [...previous]
      }, [])
    })

    const onExpand = (val: any): void => (expandedDescriptionTab.value = { ...val?.item })

    const emitChange = () => emit('onChange', [...form.value])

    const addItem = (): void => {
      form.value = [{ ...newDescriptionTab.value }, ...form.value]
      newDescriptionTab.value = descriptionTemplate()
      emitChange()
    }

    const updateItem = (key: string, value: ProductDescription) => {
      form.value = form.value.map((item) => (item.key === value.key ? value : item))
      emitChange()
    }

    const onDelete = (key: string) => {
      form.value = form.value.filter((description) => description.key !== key)
      emitChange()
      emit('onDeletedKey', key)
    }

    const rules = [(val: string): ValidationRule => useNotEmptyValidationRule(val)]

    return {
      form,
      newDescriptionTab,
      descriptionTableSize,
      addItem,
      updateItem,
      onDelete,
      onExpand,
      expandedDescriptionTab,
      rules,
      missingTranslations,
      translatedDescriptions
    }
  }
})
</script>
