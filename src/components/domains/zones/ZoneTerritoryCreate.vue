<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <div class="d-flex flex-column my-4 flex-gap-32">
        <territory-inputs v-model="territory" class="d-flex flex-column flex-gap-16" />

        <div class="d-flex justify-end my-4">
          <v-btn :loading="loading" :disabled="!valid" depressed color="primary" type="submit">
            {{ $t('Save') }}
          </v-btn>
        </div>
      </div>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { v4 as uuidv4 } from 'uuid'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import TerritoryInputs from '@/components/domains/zones/TerritoryInputs.vue'
import useApi from '@/composable/useApi'
import type { NewZone, Territory, Zone } from '@futureecom/futureecom-js/dist/services/zone-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ZoneTerritoryCreate',

  components: { TerritoryInputs, FormValidatorWrapper },

  props: {
    zone: {
      type: Object as PropType<NewZone | Zone>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()
    const loading = ref(false)

    const template = (): Territory => ({
      id: uuidv4(),
      country_code: '',
      administrative_area: null,
      locality: null,
      dependent_locality: null,
      included_postal_codes: null,
      excluded_postal_codes: null
    })

    const territory = ref<Territory>(template())

    const zoneExists = (zone: NewZone | Zone): zone is Zone => 'id' in zone

    const createHandler = (): void => {
      zoneExists(props.zone) ? createTerritoryRequest(props.zone) : emit('onCreated', territory.value)
    }

    const createTerritoryRequest = (zone: Zone) => {
      loading.value = true

      api.zones
        .createTerritory(zone.id, territory.value)
        .then((val: Zone) => {
          root.$toast.addSuccessToast(root.$t('Created territory'))
          const currentTerritoryIds = (zone.territories || []).map((item) => item.id)
          const createdTerritory = (val.territories || []).find((item) => !currentTerritoryIds.includes(item.id))
          emit('onCreated', createdTerritory)
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to create territory')))
        .finally(() => (loading.value = false))
    }

    return {
      loading,
      territory,
      createHandler
    }
  }
})
</script>
