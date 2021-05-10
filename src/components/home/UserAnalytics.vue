<template>
    <v-col cols="12" sm="6" class="mt-5">
        <v-card class="pa-3">
            <v-btn
                :v-show="true"
                color="info"
                fab
                dark
                large
                style="border-radius: 5px;"
                absolute
                top
                left
            >
                <v-icon>mdi-account-multiple</v-icon>
            </v-btn>
            <p class="text-right text-subtitle-1 font-weight-bold">
                Usuários
            </p>
            <div class="justify-space-between">
                <v-chip color="grey" outlined class="mb-3 mr-2"> Novos: {{ users.new }} </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Bloqueados: {{ users.blocked }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Ativos: {{ users.active }}
                </v-chip>
                <v-chip color="grey" outlined class="mb-3 mr-2">
                    Atualizar: {{ users.update }}
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
            users: {}
        };
    },
    async mounted() {
        this.users = await AnalyticsService.getUserAnalytics();
    }
};
</script>
