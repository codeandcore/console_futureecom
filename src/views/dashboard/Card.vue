<!-- Card.vue -->
<template>
    <v-card class="bg_primary text-white card_box">
        <v-card-title class="d-flex flex-nowrap mail_title">
            <img :src="icon" alt="Icon" />
            <span class="font-weight-regular">{{ title }}</span>
        </v-card-title>
        <v-card-subtitle v-if="price" class="text-white price_text font-weight-bold">{{ price }}</v-card-subtitle>
        <v-container>
            <v-row class="d-flex flex-nowrap">
                <v-col cols="4" class="d-flex flex-nowrap">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                            <g clip-path="url(#clip0_562_724)">
                                <path
                                    d="M13.3062 4.91307C13.3428 4.44248 12.9894 4.04931 12.5176 4.03569L6.47847 3.86138C6.00667 3.84776 5.59384 4.21882 5.55723 4.6894C5.52063 5.15998 5.87402 5.55316 6.34582 5.56677L10.3261 5.67978L4.08691 11.2877C3.72696 11.6112 3.68508 12.1495 3.99321 12.4924C4.30133 12.8352 4.84108 12.8507 5.20104 12.5272L11.4403 6.91933L11.1316 10.8873C11.095 11.3579 11.4484 11.7511 11.9202 11.7647C12.392 11.7783 12.8049 11.4072 12.8415 10.9366L13.31 4.91318L13.3062 4.91307Z"
                                    fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_562_724">
                                    <rect width="10" height="14" fill="white"
                                        transform="translate(10.4121) rotate(48.0505)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </span>
                    <v-card-text v-if="growth" class="text-white pa-0">{{ growth }}</v-card-text>
                </v-col>
                <v-col cols="8">
                    <v-card-text v-if="thisweek" class="text-white w-75 pa-0">
                        <span>{{ thisweek }}</span>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    name: 'Card',
    props: {
        icon: String,
        title: String,
        price: String,
        growth: String,
        thisweek: String,
    },
    // Add your component logic here
});
</script>