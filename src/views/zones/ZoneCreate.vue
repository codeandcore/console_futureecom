<template>
  <scrollable-wrapper @submit="createHandler">
    <template #top="{ valid }">
      <resource-header :back-to="{ name: 'zones' }" :header="$t('Add new zone')">
        <template #actions>
          <div class="d-flex justify-end flex-gap-16">
            <v-btn :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
              {{ $t('Create') }}
            </v-btn>
          </div>
        </template>
      </resource-header>
      </resource-header>
    </template>
    <template #content>
      <div class="d-flex flex-column align-center">
        <zone-inputs v-model="item" class="my-6 col-10 d-flex flex-column flex-gap-16" />
      </div>
    </template>
  </scrollable-wrapper>
</template>

<script lang='ts'>
import { NewZone, Territory } from '@futureecom/futureecom-js/dist/services/zone-service'
import { defineComponent, ref } from '@vue/composition-api'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'
import ZoneInputs from '@/components/domains/zones/ZoneInputs.vue'
import useApi from '@/composable/useApi'

interface CreateZone extends Omit<NewZone, 'territories'> {
  territories: Territory[]
}

export default defineComponent({
  name: 'ZoneCreate',

  components: { ResourceHeader, ZoneInputs, ScrollableWrapper },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const item = ref<CreateZone>({
      label: '',
      code: '',
      territories: []
    })

    const createHandler = () => {
      if (!item.value) {
        return
      }

      const { territories, ...rest } = item.value
      const territoriesWithoutIds = (territories || []).map((item: Territory) => {
        const { id, ...rest } = item
        return rest
      })

      loading.value = true
      api.zones
        .createZone({ ...rest, territories: territoriesWithoutIds })
        .then(({ id }) => {
          root.$toast.addSuccessToast('Created zone')
          root.$router.push({ name: 'zone-update', params: { id } }).catch()
        })
        .catch(() => root.$toast.addErrorToast('Unable to create zone'))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading
    }
  }
})
</script>
