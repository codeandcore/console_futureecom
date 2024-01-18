<template>
  <v-expansion-panel>
    <v-expansion-panel-header :expand-icon="'$expand'">
      <span class="text-body-2">{{ title }}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content v-if="items.length">
      <v-list flat>
        <v-list-item v-for="(subItem, key) in items" :key="key">
          <v-list-item-content class="text-caption">
            <router-link :to="subItem.link">
              {{ subItem.title }}
            </router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { NavigationMenuItem } from '@/types/NavigationMenuItem'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SubmenuItem',
  props: {
    items: {
      type: Array as PropType<NavigationMenuItem[]>,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
})
</script>
