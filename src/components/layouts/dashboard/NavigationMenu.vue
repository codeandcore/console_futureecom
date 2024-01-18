<template>
  <v-expansion-panels accordion class="navigation-menu primary rounded-0" multiple flat data-cy="navigation-menu">
    <template v-if="menuItems.length">
      <v-expansion-panel v-for="item in menuItems" :key="item.icon" :readonly="!item.submenu">
        <v-expansion-panel-header :expand-icon="item.submenu ? '$expand' : 'mdi-blank'" class="primary">
          <component :is="item.submenu ? 'span' : 'router-link'" v-bind="{ to: item.submenu ? undefined : item.link }">
            <v-icon class="me-3 text-white">
              {{ item.icon }}
            </v-icon>
            <span class="text-body-2 text-white">{{ item.title }}</span>
          </component>
        </v-expansion-panel-header>

        <v-expansion-panel-content v-if="item.submenu" class="primary">
          <v-list flat>
            <v-list-item v-for="(subItem, key) in item.submenu" :key="key">
              <v-list-item-content class="text-caption text-white">
                <submenu-item v-if="subItem.submenu" :title="subItem.title" :items="subItem.submenu" />
                <router-link v-else :to="subItem.link" >
                  {{ subItem.title }}
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
  </v-expansion-panels>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useStores } from '@/composable/repositories/useStores'
import { zeroOrganisation } from '@/composable/repositories/useOverview'
import SelectTenancy from '@/components/layouts/dashboard/SelectTenancy.vue'
import SubmenuItem from '@/components/layouts/dashboard/SubmenuItem.vue'
import navigationMenu from '@/config/navigation/navigationMenu'

export default defineComponent({
  name: 'NavigationMenu',
  components: { SelectTenancy, SubmenuItem },

  setup() {
    const { currentOrganisation } = useOrganisations()
    const { currentStore } = useStores()

    const menuItems = computed(() => navigationMenu(currentOrganisation.value || zeroOrganisation, currentStore.value))

    return {
      menuItems
    }
  }
})
</script>
