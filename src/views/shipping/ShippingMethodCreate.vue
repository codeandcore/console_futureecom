<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header :back-to="{ name: 'shipping-methods' }" :header="$t('Add new shipping method')">
            <template #actions>
              <shipping-method-action-get v-model="item" />
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <v-btn v-bind="$attrs" :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div v-if="item" class="d-flex flex-column align-center">
            <shipping-method-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { ShippingPriceType, ShippingType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { defineComponent, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import ShippingMethodInputs from '@/components/domains/shipping/ShippingMethodsInputs.vue'
import useApi from '@/composable/useApi'
import type { BaseShipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethodCreate',

  components: {
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper,
    ShippingMethodInputs
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const item = ref<BaseShipping>({
      name: '',
      code: '',
      price_type: ShippingPriceType.FIXED,
      enabled: false,
      type: ShippingType.DELIVERY
    })

    const createHandler = () => {
      if (!item.value) {
        return
      }

      loading.value = true
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.carts
        .createShipping({ ...item.value, translations })
        .then(({ id }) => {
          root.$toast.addSuccessToast('Created shipping method')
          root.$router.push({ name: 'shipping-method-update', params: { id } })
        })
        .catch(() => root.$toast.addErrorToast('Unable to create shipping method'))
        .finally(() => (loading.value = false))
    }

    return {
      createHandler,
      loading,
      item
    }
  }
})
</script>
