<template>
  <v-container>
    <v-row>    
      <v-col cols="6">
        <h2 class="my-4 text-gray" cols="12">
          Welcome Back Omar
        </h2>
        <p class="text-light-gray">Explore and learn how Qualified Hardware has been performing</p>     
      </v-col>
      <v-col cols="6" class="d-flex flex-row-reverse align-end">
        <v-btn color="primary rounded-0"  elevation="0" large>
          {{ $t('View Advance Report') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <dashbourd-tabs/>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(card, key) in cards" :key="key" cols="12" sm="6" lg="3">
        <v-card outlined>
          <v-card-title :class="card.color" class="white--text">
            {{ card.title }}
          </v-card-title>
          <v-divider />
          <v-card-text class="d-flex justify-end align-end">
            <span class="text-h2 pt-12">{{ card.value }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import DashbourdTabs from '@/views/DashbourdTabs.vue'

export default defineComponent({ 
  components: { DashbourdTabs }, 
  setup() {
    const { t } = useI18n()

    const cards = computed(() => {
      return [
        { title: t('Orders'), value: 600, color: 'primary' },
        { title: t('Customers'), value: 123, color: 'secondary' },
        { title: t('Products'), value: 5233, color: 'info' },
        { title: t('On-Line'), value: 10, color: 'success' }
      ]
    })

    return { cards }
  }
})
</script>
