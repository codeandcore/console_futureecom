<template>
  <v-app>
    <v-main class="primary">
      <div class="d-flex align-center justify-center fill-height">
        <div class="d-flex flex-column align-center flex-gap-16">
          <v-img width="200px" src="/img/logotype.png" />
          <v-card min-width="600">
            <v-card-title class="justify-space-between">
              <h1 class="flex my-4 primary--text">
                {{ isOverviewType ? $t('Overview') : $t('Console') }}
              </h1>
              <language-switch />
            </v-card-title>
            <router-view />
          </v-card>
        </div>
      </div>
    </v-main>
    <toasts-queue />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { isOverviewType } from '@/libs/isOverview'
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import ToastsQueue from '@/components/common/ToastsQueue.vue'

export default defineComponent({
  name: 'FrontpageLayout',

  components: {
    LanguageSwitch,
    ToastsQueue
  },

  setup() {
    return {
      isOverviewType
    }
  }
})
</script>
