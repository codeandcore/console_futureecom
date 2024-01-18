<template>
  <v-tabs v-if="selectedTabIndex >= 0" v-model="selectedTabIndex" vertical class="mt-0 px-0" @change="update">
    <template v-for="(tabItem, index) in items">
      <v-tab v-if="!!tabItem.to" :key="`menu-${index}`" class="justify-start px-1">
        <slot :name="`router.${tabItem.code}`" :item="tabItem">
          <router-link :to="tabItem.to">
            <slot name="tab.icon-back">
              <v-icon v-if="!tabItem.forwarding" class="py-4 px-2">chevron_left</v-icon>
            </slot>
            <slot :name="`tab.${tabItem.code}`" :item="tabItem">
              <span class="mx-3">{{ $t(tabItem.name) }}</span>
            </slot>
            <slot name="tab.icon-forward">
              <v-icon v-if="tabItem.forwarding" class="mx-3">chevron_right</v-icon>
            </slot>
          </router-link>
        </slot>
      </v-tab>
      <slot v-else :name="`router.${tabItem.code}`" :item="tabItem">
        <v-tab :key="tabItem.code" class="justify-start">
          <slot :name="`tab.${tabItem.code}`" :item="tabItem">
            {{ $t(tabItem.name) }} {{ tabItem.hasRequired ? '*' : '' }}
          </slot>
        </v-tab>
      </slot>
    </template>
  </v-tabs>
  <v-tabs v-else vertical class="mt-0 px-0">
    <template v-for="(tabItem, index) in items">
      <v-tab v-if="tabItem.to" :key="`menu-${index}`" class="justify-start">
        <router-link :to="tabItem.to">
          {{ $t(tabItem.name) }}
          <v-icon class="mx-3">chevron_right</v-icon>
        </router-link>
      </v-tab>
    </template>
  </v-tabs>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useTabsRoute } from '@/composable/useTabsRoute'
import type { TabNavigationRoute } from '@/composable/useTabsRoute'

export default defineComponent({
  name: 'TabNavigationRouteMenu',

  props: {
    items: {
      type: Array as () => TabNavigationRoute[],
      required: true
    },
    routeParamName: {
      type: String,
      default: 'option'
    }
  },

  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()

    const update = (): void => emit('input', selectedTabIndex.value)

    const { selectedTabIndex, tabRouteWatcher } = useTabsRoute(props.items, `${route.params[props.routeParamName]}`)

    tabRouteWatcher(() => {
      router.push({ params: { [props.routeParamName]: props.items[selectedTabIndex.value].code } }).catch(() => {})
      update()
    })

    update()

    return {
      selectedTabIndex,
      update
    }
  }
})
</script>
