<template>
  <div>
    <div ref="header">
      <slot name="header" :current-tab="routeParam">
        <div class="mx-8 py-4 d-flex justify-space-between align-center">
          <slot name="header-title" :current-tab="routeParam">
            <span class="text-h6">
              <slot name="header-title-text" :current-tab="routeParam" />
            </span>
          </slot>
          <slot name="header-button" :current-tab="routeParam" />
        </div>
        <v-divider />
      </slot>
    </div>
    <slot name="content" :available-height="availableHeight">
      <div class="d-flex">
        <template v-if="items.length">
          <scrollable hide-top hide-bottom :height="`${availableHeight}px`" class="col-3 ma-0 pa-0">
            <template #scrollable>
              <slot name="content-tabs">
                <div v-if="items.length" class="d-flex flex-column">
                  <template v-for="(tabItem, index) in items">
                    <slot v-if="!tabItem.component" :name="`tab-${tabItem.code}`" :data-cy="`tab-${tabItem.code}`" />
                    <v-card
                      v-else
                      :key="`item-${index}`"
                      class="d-flex"
                      :to="{ params: { [routeParamName]: tabItem.code } }"
                      flat
                      color="transparent"
                      :data-cy="`tab-${tabItem.code}`"
                    >
                      <v-sheet
                        :key="`sheet-${index}`"
                        :color="tabItem.code === routeParam ? 'primary' : ''"
                        :width="4"
                      />
                      <slot :name="`tab-${tabItem.code}`">
                        <div class="my-4 ms-4">
                          <slot :name="`tab-label-${tabItem.code}`" :item="tabItem">
                            <span>{{ tabItem.name }}</span>
                          </slot>
                          <slot :name="`tab-content-${tabItem.code}`" />
                        </div>
                      </slot>
                    </v-card>
                  </template>
                </div>
              </slot>
            </template>
          </scrollable>
          <v-divider vertical class="mx-0" />
        </template>
        <scrollable :height="`${availableHeight}px`" class="ma-0 pa-0" :class="items.length ? 'col-9' : 'col-12'">
          <template #scrollable>
            <v-window :value="currentIndex">
              <slot v-if="!items.length" name="scrollable.content" />
              <template v-else>
                <slot name="content-top" />
                <v-window-item
                  v-for="(tabItem, index) in items"
                  :key="`content-${index}`"
                  :data-cy="`content-${tabItem.code}`"
                  :eager="eager"
                >
                  <slot
                    :name="`content-${tabItem.code}`"
                    :content="tabItem"
                    :current-tab="$route.params[routeParamName]"
                  />
                </v-window-item>
              </template>
            </v-window>
          </template>
        </scrollable>
      </div>
      <slot />
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { useRoute } from '@/composable/migrateUseRoute'
import { useVuetify } from '@/composable/useVuetify'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { ComponentOptions } from 'vue/types/options'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export interface ScrollableResourceDefinitions<Section = string> {
  code: Section
  name?: string | TranslateResult
  component?: ComponentOptions<any>
}

export default defineComponent({
  name: 'ScrollableResource',
  components: { Scrollable },
  props: {
    items: {
      type: Array as PropType<ScrollableResourceDefinitions<any>[]>,
      default: () => []
    },
    routeParamName: {
      type: String,
      default: 'option'
    },
    eager: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const vuetify = useVuetify()
    const route = useRoute()

    const header = ref(null)
    const headerSize = useElementSize(header)
    const windowSize = useWindowSize()
    const availableHeight = computed((): number => {
      return windowSize.height.value - (vuetify?.application.top || 0) - headerSize.height.value || 0
    })

    const routeParam = computed((): string => {
      if (route.params[props.routeParamName]) {
        return route.params[props.routeParamName]
      }
      const index = (props.items || []).findIndex((item) => !!item.component)

      if (props.items[index]?.component) {
        return props.items[index].code
      }

      return ''
    })

    const currentIndex = computed((): number => {
      const index = props.items?.findIndex((item) => item.code === routeParam.value)
      return index >= 0 ? index : 0
    })
    return {
      header,
      availableHeight,
      currentIndex,
      routeParam
    }
  }
})
</script>
