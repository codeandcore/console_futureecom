<!-- Today.vue -->
<template>
    <v-container>
        <div class="inner_container ml-0">
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
    name: 'Today',
    components: {
        Card,
    },
    // Add your component logic here
});
</script>
  