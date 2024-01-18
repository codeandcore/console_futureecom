<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header :back-to="{ name: 'boxes' }" :header="$t('Add new box')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn v-bind="$attrs" :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div class="d-flex flex-column align-center">
            <box-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useRouter } from '@intlify/vue-router-bridge'
import BoxInputs from '@/components/domains/boxes/BoxInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BaseBox } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'BoxCreate',

  components: {
    BoxInputs,
    FormValidatorWrapper,
    ScrollableResource,
    ResourceHeader
  },

  setup(props, { root }) {
    const router = useRouter()
    const api = useApi()
    const loading = ref(false)

    const item = ref<Partial<BaseBox>>({
      name: '',
      active: false
    })

    const areBoxFieldsFilled = (val: Partial<BaseBox>): val is BaseBox => {
      const fields: (keyof BaseBox)[] = [
        'name',
        'outer_width',
        'outer_length',
        'outer_depth',
        'empty_weight',
        'inner_width',
        'inner_length',
        'inner_depth',
        'max_weight'
      ]

      return fields.every((field) => item.value[field] !== '')
    }

    const createHandler = () => {
      if (!item.value || !areBoxFieldsFilled(item.value)) {
        return
      }

      loading.value = true

      api.carts
        .createBox(item.value)
        .then(({ id }) => {
          root.$toast.addSuccessToast(root.$t('Created box'))
          router.push({ name: 'box-update', params: { id } }).catch()
        })
        .catch((err) => root.$toast.addErrorToast(err.response?.data.message || root.$t('Unable to create box')))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      loading,
      createHandler
    }
  }
})
</script>
