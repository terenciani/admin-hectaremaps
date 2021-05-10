<template>
    <v-col cols="12" sm="6" class="mt-5">
        <v-card class="pa-3">
            <v-btn
                :v-show="true"
                color="warning"
                fab
                dark
                large
                style="border-radius: 5px;"
                absolute
                top
                left
            >
                <v-icon>mdi-drone</v-icon>
            </v-btn>
            <p class="text-right text-subtitle-1 font-weight-bold">
                Meus Serviços
            </p>
            <div class="justify-space-between">
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Novas Solicitações: {{ requests.created }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Solicitações Atendidas: {{ requests.finished }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Solicitações em Processamento: {{ requests.processing }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Produzindo relatório: {{ requests.attached }}
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
            requests: {}
        };
    },
    async mounted() {
        this.requests = await AnalyticsService.getUserRequestsAnalytics();
    }
};
</script>
