<template>
  <div class="justify-center">
    <subresource-expansion-panel :key="territories.length" :can-create="true">
      <template #header>
        <span>{{ $t('Territories') }}</span>
      </template>
      <template #content>
        <div>
          <zone-territory-create :zone="value" @onCreated="onTerritoryCreated" />
        </div>
      </template>
    </subresource-expansion-panel>

    <v-data-table
      item-key="id"
      show-expand
      single-expand
      :items="territories"
      :headers="territoryHeaders"
      class="v-data-table-shadowless"
    >
      <template #item.country="{ item }">
        {{ getCountryName(item.country_code) }}
      </template>
      <template #expanded-item="{ headers: h, item }">
        <td :colspan="h.length" class="py-6">
          <v-card flat>
            <zone-territory-update
              :value="item"
              :zone="value"
              @onUpdated="onTerritoryUpdated"
              @onDeleted="onTerritoryDeleted(item.id)"
            />
          </v-card>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import SubresourceExpansionPanel from '@/components/tables/subresources/SubresourceExpansionPanel.vue'
import ZoneTerritoryCreate from '@/components/domains/zones/ZoneTerritoryCreate.vue'
import ZoneTerritoryUpdate from '@/components/domains/zones/ZoneTerritoryUpdate.vue'
import type { PropType } from '@vue/composition-api'
import type { Territory, Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'ZoneTerritories',

  components: { SubresourceExpansionPanel, ZoneTerritoryUpdate, ZoneTerritoryCreate },

  props: {
    value: {
      type: Object as PropType<Zone>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const territories = computed({
      get: () => structuredClone(props.value.territories || []),
      set: (territories) => emit('input', { ...props.value, territories })
    })

    const onTerritoryCreated = (newTerritory: Territory) => {
      territories.value = [...territories.value, newTerritory]
    }

    const onTerritoryUpdated = (updatedTerritory: Territory) => {
      territories.value = territories.value.map((item) => (item.id === updatedTerritory.id ? updatedTerritory : item))
    }

    const onTerritoryDeleted = (territoryId: string) => {
      territories.value = territories.value.filter((item) => item.id !== territoryId)
    }

    const territoryHeaders = computed(() => [
      { text: root.$t('Country'), value: 'country' },
      { text: root.$t('Country Code'), value: 'country_code' },
      { text: root.$t('Actions'), value: 'data-table-expand' }
    ])

    return {
      territoryHeaders,
      onTerritoryCreated,
      onTerritoryDeleted,
      onTerritoryUpdated,
      getCountryName: useCountries().getCountryName,
      territories
    }
  }
})
</script>
