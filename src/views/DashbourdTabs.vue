<!-- DashboardTabs.vue -->
<template>
  <v-app>
    <v-card class="" elevation="0">
      <v-container class="pa-0">
        <v-toolbar elevation="0">
          <template>
            <v-col>
              <v-row class="mb-6">
                <v-tabs v-model="tab" class="tab_heading">
                  <v-tab v-for="item in items" :key="item" class="font-weight-bold">
                    {{ item }}
                  </v-tab>
                </v-tabs>
              </v-row>
            </v-col>
          </template>
        </v-toolbar>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, index) in items" :key="item">
            <v-card flat>
              <v-card-text v-if="tabComponents[item]" is="keep-alive">
                <component :is="tabComponents[item]" />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Today from './dashboard/Today.vue';
import ThisWeek from './dashboard/ThisWeek.vue';
import ThisMonth from './dashboard/ThisMonth.vue';
import LastMonth from './dashboard/LastMonth.vue';
import ComparisonChart from './dashboard/ComparisonChart.vue';

export default defineComponent({
  name: 'DashboardTabs',
  components: {
    Today,
    ThisWeek,
    ThisMonth,
    LastMonth,
    ComparisonChart,
  },
  data() {
    return {
      tab: null,
      items: ["Today", "This Week", "This Month", "Last Month", "Comparison Chart"],
      tabComponents: {
        "Today": 'Today',
        'This Week': 'ThisWeek',
        'This Month': 'ThisMonth',
        'Last Month': 'LastMonth',
        'Comparison Chart': 'ComparisonChart',
      },
      // ... (existing data)
    };
  },
});
</script>
