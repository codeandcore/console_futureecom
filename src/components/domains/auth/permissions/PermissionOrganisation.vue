<template>
  <v-select
    v-bind="$attrs"
    :value="org"
    :label="$t('Organisation')"
    item-text="name"
    item-value="code"
    return-object
    outlined
    :items="availableOrganisations"
    hide-details="auto"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { accessToken } from '@/libs/api'
import { computed, defineComponent } from '@vue/composition-api'
import { permissionChecker } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Permission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { abilities } from '@/types/Abilities'

export default defineComponent({
  name: 'PermissionOrganisation',

  props: {
    value: {
      type: Object as PropType<Permission>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { collection: organisations } = useOrganisations()

    const org = computed(() => props.value.org)

    const abilities: abilities[] = ['create,auth\\permission', 'update,auth\\permission', 'manage,auth\\permission']

    const availableOrganisations = computed(() => {
      const canSetAnyOrg = abilities.some((ability) => permissionChecker(accessToken.value, ability, '*'))

      const overview = {
        id: 0,
        name: '*',
        code: '*',
        stores: []
      }

      const orgs = organisations.value.filter((org) => org.code !== 'overview')
      return canSetAnyOrg ? [overview, ...orgs] : orgs
    })

    const onSelect = (org: Organisation) => {
      emit('update:org', org)

      emit('input', {
        ...props.value,
        org: org.code,
        store: org.code === '*' ? org.code : '',
        resource: '',
        action: ''
      })
    }

    return {
      org,
      availableOrganisations,
      onSelect
    }
  }
})
</script>
