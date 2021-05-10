<template>
    <v-col cols="12" sm="6" class="mt-5">
        <v-card class="pa-3">
            <v-btn
                :v-show="true"
                color="success"
                fab
                dark
                large
                style="border-radius: 5px;"
                absolute
                top
                left
            >
                <v-icon>mdi-sitemap</v-icon>
            </v-btn>
            <p class="text-right text-subtitle-1 font-weight-bold">
                Planos
            </p>
            <div class="justify-space-between">
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Contratações de hoje: {{ plans.today }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Usuários com planos: {{ plans.users }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Ativos: {{ plans.active }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Usuários sem Planos: {{ plans.nusers }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Total de contratações: {{ plans.total }}
                </v-chip>
            </div>
        </v-card>
    </v-col>
</template>
<script>
import AnalyticsService from '../../service/AnalyticsService';
export default {
    data() {
        return {
            plans: {}
        };
    },
    async mounted() {
        this.plans = await AnalyticsService.getPlanAnalytics();
    }
};
</script>
