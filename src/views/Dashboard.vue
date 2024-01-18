<template>
  <v-container>
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

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const cards = computed(() => {
      return [
        { title: t('Orders'), value: 500, color: 'primary' },
        { title: t('Customers'), value: 123, color: 'secondary' },
        { title: t('Products'), value: 5233, color: 'info' },
        { title: t('On-Line'), value: 10, color: 'success' }
      ]
    })

    return { cards }
  }
})
</script>
