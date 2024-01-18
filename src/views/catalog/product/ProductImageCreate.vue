<template>
  <v-dialog v-model="isOpen" width="800" scrollable>
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ attrs, on, isOpen }" />
    </template>
    <v-form @submit.prevent="createHandler">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Add product image') }}</span>
          <v-icon @click="onDialogClose">close</v-icon>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <product-image-inputs v-model="item" :errors="errors" @input="onItemChange" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="d-flex justify-end pa-4">
          <v-btn depressed :disabled="loading || !isValid" :loading="loading" type="submit" color="primary">
            {{ $t('Save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import { v4 as uuidv4 } from 'uuid'
import ProductImageInputs from '@/components/domains/products/inputs/ProductImageInputs.vue'
import useApi from '@/composable/useApi'
import type { Product, ProductImage } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'ProductImageCreate',

  components: {
    ProductImageInputs
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const getTemplate = (): ProductImage => ({
      id: uuidv4(),
      url: '',
      alt: '',
      sort_order: 0,
      product_id: props.value.id
    })

    const item = ref<ProductImage>(getTemplate())

    const isOpen = ref(false)

    const loading = ref(false)
    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = { url: ['required', 'string'] }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = async (): Promise<void> => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      if (props.value.id) {
        loading.value = true
        await useApi()
          .catalog.createProductImage(props.value.id, item.value)
          .then((val) => {
            addSuccessToast(t('Image has been added'))
            //@ts-expect-error
            item.value = val
          })
          .catch((err) => {
            if (err.response?.data.message) {
              addErrorToast(err.response?.data.message)
            }
            setErrorsFromAPI(err.response?.data.errors || {})
          })
          .finally(() => (loading.value = false))
      }

      isOpen.value = false
      emit('created', item.value)
    }

    const onDialogClose = () => {
      isOpen.value = false
      item.value = getTemplate()
    }

    return {
      item,
      errors,
      isValid,
      loading,
      isOpen,
      onDialogClose,
      createHandler,
      onItemChange
    }
  }
})
</script>
