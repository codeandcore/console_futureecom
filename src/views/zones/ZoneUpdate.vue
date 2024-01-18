<template>
  <scrollable-wrapper @submit="updateHandler">
    <template #top="{ valid }">
      <resource-header v-if="item" :back-to="{ name: 'zones' }" :header="`Zone: ${item.label}`" :subheader="item.id">
        <template #actions>
          <div class="d-flex justify-end flex-gap-16">
            <zone-action-delete
              v-if="canDelete"
              :value="item"
              :loading.sync="loading.delete"
              :disabled="loading.update"
              @onSuccess="redirectToZonesGrid"
            />
            <v-btn
              v-if="canUpdate"
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
    </template>
    <template #content>
      <div v-if="item" class="d-flex flex-column align-center">
        <zone-inputs v-model="item" class="my-6 col-10 d-flex flex-column flex-gap-16" />
      </div>
    </template>
  </scrollable-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'
import ZoneActionDelete from '@/components/domains/zones/actions/ZoneActionDelete.vue'
import ZoneInputs from '@/components/domains/zones/ZoneInputs.vue'
import useApi from '@/composable/useApi'
import type { Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'ZoneUpdate',

  components: { ResourceHeader, ZoneActionDelete, ZoneInputs, ScrollableWrapper },

  setup(props, { root }) {
    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Zone>()

    const canCreate = computed(() => root.$canAny('manage,zones\\zone', 'create,zones\\zone').value)
    const canUpdate = computed(() => root.$canAny('manage,zones\\zone', 'update,zones\\zone').value)
    const canDelete = computed(() => root.$canAny('manage,zones\\zone', 'delete,zones\\zone').value)

    const redirectToZonesGrid = () => root.$router.push({ name: 'zones' })

    api.zones
      .getZone(root.$route.params.id)
      .then((val) => (item.value = val))
      .catch(() => {
        root.$toast.addErrorToast(root.$t('Zone not found'))
        canCreate.value ? root.$router.push({ name: 'zone-create' }) : redirectToZonesGrid()
      })
      .finally(() => (loading.get = false))

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      const { code, territories, ...rest } = item.value

      api.zones
        .updateZone(item.value.id, rest)
        .then((zone) => {
          root.$toast.addSuccessToast('Updated zone')
          item.value = zone
        })
        .catch(() => root.$toast.addErrorToast('Unable to update zone'))
        .finally(() => (loading.update = false))
    }

    return {
      item,
      updateHandler,
      canUpdate,
      canDelete,
      loading,
      redirectToZonesGrid
    }
  }
})
</script>
