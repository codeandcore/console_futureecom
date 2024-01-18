<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'shipping-methods' }"
            :header="`Shipping Method: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <shipping-method-action-delete
                  v-if="$canAny('manage,cart\\shipping', 'delete,cart\\shipping')"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToShippingMethodsGrid"
                />
                <v-btn
                  v-if="$canAny('manage,cart\\shipping', 'update,cart\\shipping')"
                  depressed
                  color="primary"
                  :disabled="!valid || loading.delete"
                  :loading="loading.update"
                  type="submit"
                >
                  {{ $t('Update') }}
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
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import ShippingMethodActionDelete from '@/components/domains/shipping/ShippingMethods/actions/ShippingMethodActionDelete.vue'
import ShippingMethodInputs from '@/components/domains/shipping/ShippingMethodsInputs.vue'
import useApi from '@/composable/useApi'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethodUpdate',

  components: {
    ResourceHeader,
    ShippingMethodActionDelete,
    ScrollableResource,
    FormValidatorWrapper,
    ShippingMethodInputs
  },

  setup(props, { root }) {
    const api = useApi()

    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const item = ref<Shipping>()

    const redirectToShippingMethodsGrid = () => root.$router.push({ name: 'shipping-methods' })
    const redirectToShippingMethodId = (id: string) => root.$router.push({ params: { id } }).catch()

    const onErrorFetch = () => {
      root.$toast.addErrorToast('Shipping method not found')
      const canCreate = root.$canAny('manage,cart\\shipping', 'create,cart\\shipping').value
      canCreate ? redirectToShippingMethodId('__') : redirectToShippingMethodsGrid()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.carts
        .updateShipping(item.value.id, { ...item.value, translations })
        .then((val) => {
          root.$toast.addSuccessToast('Updated shipping method')
          item.value = val
        })
        .catch(() => root.$toast.addErrorToast('Unable to update shipping method'))
        .finally(() => (loading.update = false))
    }

    api.carts
      .getShipping(root.$route.params.id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      updateHandler,
      redirectToShippingMethodsGrid,
      loading,
      item
    }
  }
})
</script>
