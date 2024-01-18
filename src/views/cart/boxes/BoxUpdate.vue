<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'boxes' }"
            :header="`${$t('Box')}: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <box-action-delete
                  v-if="canDelete"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToGrid"
                />
                <v-btn
                  v-if="canUpdate"
                  depressed
                  color="primary"
                  :disabled="!valid"
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
            <box-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import BoxActionDelete from '@/components/domains/boxes/Box/actions/BoxActionDelete.vue'
import BoxInputs from '@/components/domains/boxes/BoxInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Box } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'BoxUpdate',

  components: {
    BoxInputs,
    BoxActionDelete,
    FormValidatorWrapper,
    ScrollableResource,
    ResourceHeader
  },

  setup(props, { root }) {
    const router = useRouter()
    const route = useRoute()

    const { id } = route.params
    const api = useApi()

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const canUpdate = computed((ctx) => ctx.$canAny('manage,cart\\box', 'update,cart\\box').value)
    const canDelete = computed((ctx) => ctx.$canAny('manage,cart\\box', 'delete,cart\\box').value)
    const canCreate = computed((ctx) => ctx.$canAny('manage,cart\\box', 'create,cart\\box').value)

    const item = ref<Box>()

    const redirectToGrid = () => router.push({ name: 'boxes' })

    const onErrorFetch = () => {
      root.$toast.addErrorToast(root.$t('Box not found'))
      canCreate.value ? router.push({ name: 'box-create' }) : redirectToGrid()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true
      const { organisation, store, id, updated_at, created_at, ...rest } = item.value

      api.carts
        .updateBox(id, { ...rest })
        .then((val) => {
          root.$toast.addSuccessToast(root.$t('Updated box'))
          item.value = val
        })
        .catch((err) => root.$toast.addErrorToast(err.response?.data.message || root.$t('Unable to update box')))
        .finally(() => (loading.update = false))
    }

    api.carts
      .getBox(`${id}`)
      .then((value) => (item.value = value))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      canDelete,
      item,
      loading,
      canUpdate,
      updateHandler,
      redirectToGrid
    }
  }
})
</script>
