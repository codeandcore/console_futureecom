<template>
  <scrollable class="align-center justify-center d-flex">
    <template #scrollable>
      <div class="d-flex justify-center align-center flex-grow-1 flex-gap-32 flex-wrap mx-10">
        <v-img class="d-flex flex-grow-1 mx-10" src="@/assets/error/404.svg" alt="" max-width="800" />
        <div class="d-flex flex-column justify-center align-center flex-gap-16">
          <h1 class="text-h1 font-weight-bold text--primary">404</h1>
          <h2 class="my-3 text-h5 text-center">
            {{ $t('Sorry, page not found') }}
          </h2>
          <v-btn depressed color="primary" :to="redirectTo">
            {{ $t('Take me home') }}
          </v-btn>
        </div>
      </div>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { Location } from 'vue-router'
import { accessToken } from '@/libs/api'
import { computed, defineComponent } from '@vue/composition-api'
import Scrollable from '@/components/layouts/Scrollable.vue'

export default defineComponent({
  name: 'NotFound',

  components: { Scrollable },

  setup() {
    const redirectTo = computed((ctx): Location => {
      if (accessToken.value && ctx.$route.params.organisation && ctx.$route.params.store) {
        return { name: 'dashboard', params: { ...ctx.$route.params } }
      }
      return { name: 'login' }
    })

    return {
      redirectTo
    }
  }
})
</script>
