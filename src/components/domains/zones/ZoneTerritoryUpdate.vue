<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <div class="d-flex flex-column my-4">
        <territory-inputs v-model="territory" class="d-flex flex-column flex-gap-16" />

        <div class="d-flex mx-0 my-8 justify-space-between">
          <v-btn
            :loading="loading.delete"
            :disabled="!valid || loading.update"
            depressed
            color="secondary"
            @click="deleteHandler"
          >
            {{ $t('Delete') }}
          </v-btn>
          <v-btn
            v-if="!zone.id"
            :loading="loading.update"
            :disabled="!valid || loading.delete"
            depressed
            color="primary"
            type="submit"
          >
            {{ $t('Update') }}
          </v-btn>
        </div>
      </div>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import TerritoryInputs from '@/components/domains/zones/TerritoryInputs.vue'
import useApi from '@/composable/useApi'
import type { NewZone, Territory, Zone } from '@futureecom/futureecom-js/dist/services/zone-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ZoneTerritoryUpdate',

  components: { TerritoryInputs, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    },
    zone: {
      type: Object as PropType<NewZone | Zone>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()
    const loading = reactive({
      update: false,
      delete: false
    })

    const territory = ref<Territory>({ ...props.value })

    const zoneExists = (zone: NewZone | Zone): zone is Zone => 'id' in zone

    const updateHandler = (): void => {
      zoneExists(props.zone) ? updateTerritoryRequest(props.zone) : emit('onUpdated', territory.value)
    }

    const updateTerritoryRequest = (zone: Zone) => {
      loading.update = true

      api.zones
        .getZone(zone.id)
        .then((zone) => {
          root.$toast.addSuccessToast(root.$t('Updated territory'))
          emit('onUpdated', zone)
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to update territory')))
        .finally(() => (loading.update = false))
    }

    const deleteHandler = (): void => {
      zoneExists(props.zone) ? deleteTerritoryRequest(props.zone) : emit('onDeleted', territory.value)
    }

    const deleteTerritoryRequest = (zone: Zone) => {
      loading.delete = true

      api.zones
        .deleteTerritory(zone.id, territory.value.id)
        .then(() => {
          root.$toast.addSuccessToast(root.$t('Deleted territory'))
          emit('onDeleted', territory.value.id)
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to delete territory')))
        .finally(() => (loading.delete = false))
    }

    return {
      loading,
      territory,
      updateHandler,
      deleteHandler
    }
  }
})
</script>
