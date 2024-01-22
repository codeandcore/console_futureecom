<!-- LastMonth.vue -->
<template>
    <v-container>
        <div class="inner_container ml-0">
            <v-row class="mt-2">
                <v-col>
                    <h2 class="main_heading">So far this month, <strong>December 2023</strong></h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <card 
                        :icon="require('@/assets/images/doller.svg')" 
                        title="Gross Revenue"
                        price="$825,491.73"
                        growth="20.9%"
                        thisweek="+18.4K this week"
                    />
                </v-col>
                <v-col>
                    <card 
                        :icon="require('@/assets/images/doller.svg')" 
                        title="Revenue with Tax & Shipping"
                        price="$835,481.73"
                        growth="21.9%"
                        thisweek="+18.7K this week"
                    />
                </v-col>
                <v-col>
                    <card 
                        :icon="require('@/assets/images/order.svg')" 
                        title="Total Orders"
                        price="780,192"
                        growth="10%"
                        thisweek="+3.5K this week"
                    />                
                </v-col>
                <v-col>
                    <card 
                        :icon="require('@/assets/images/product.svg')" 
                        title="Products Sold"
                        price="520"
                        growth="4.2%"
                        thisweek="+1.4K this week"
                    />
                </v-col>
            </v-row>
        </div>
        <v-divider class="my-15"></v-divider>
    </v-container>
</template>
  
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Card from './Card.vue';

export default defineComponent({
    name: 'LastMonth',
    components: {
        Card,
    },
    // Add your component logic here
});
</script>
  