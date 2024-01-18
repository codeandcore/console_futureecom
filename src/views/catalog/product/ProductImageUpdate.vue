<template>
  <v-dialog v-model="isOpen" width="800" scrollable>
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ attrs, on, isOpen }" />
    </template>
    <v-form @submit.prevent="updateHandler">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <div class="d-flex flex-column">
            <span>{{ $t('Update product image') }}</span>
            <span class="grey--text text-caption">{{ value.id }}</span>
          </div>
          <v-icon @click="isOpen = false">close</v-icon>
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
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ProductImageInputs from '@/components/domains/products/inputs/ProductImageInputs.vue'
import useApi from '@/composable/useApi'
import type { Product, ProductImage } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'ProductImageUpdate',

  components: {
    ProductImageInputs
  },

  props: {
    value: {
      type: Object as PropType<ProductImage>,
      required: true
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const isOpen = ref(false)
    const item = ref<ProductImage>({ ...props.value })

    const loading = ref(false)
    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = { url: ['required', 'string'] }

    const onItemChange = () => validate(item.value, rules)

    const updateHandler = async (): Promise<void> => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      if (props.value.id) {
        loading.value = true
        await useApi()
          .catalog.updateProductImage(props.product.id, item.value.id, item.value)
          .then((val) => {
            addSuccessToast(t('Image has been updated'))
            item.value = val
          })
          .catch((err) => {
            const { status, data } = err.response || {}
            if (status === HTTPResponseCode.NOT_FOUND) {
              addErrorToast('Resource not found')
              return
            }
            if (status === HTTPResponseCode.UNPROCESSABLE_CONTENT) {
              setErrorsFromAPI(data.errors || {})
            }
          })
          .finally(() => (loading.value = false))
      }

      isOpen.value = false
      emit('updated', item.value)
    }

    return {
      item,
      errors,
      isValid,
      loading,
      isOpen,
      updateHandler,
      onItemChange
    }
  }
})
</script>
