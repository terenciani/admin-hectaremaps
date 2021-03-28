<template>
    <v-row class="mt-5">
        <v-col cols="12" sm="6" md="4">
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
                    <v-chip color="grey" outlined class="mb-3 mr-2">
                        Novos: {{ users.new }}
                    </v-chip>
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
        <v-col cols="12" sm="6" md="4">
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
                        Contratações de hoje: {{ users.new }}
                    </v-chip>
                    <v-chip color="grey" outlined class="mb-3 mr-2">
                        Usuários com planos: {{ users.blocked }}
                    </v-chip>
                    <v-chip color="grey" outlined class="mb-3 mr-2">
                        Ativos: {{ users.active }}
                    </v-chip>
                    <v-chip color="grey" outlined class="mb-3 mr-2">
                        Usuários sem Planos: {{ users.update }}
                    </v-chip>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
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
                    <v-icon>mdi-toolbox-outline</v-icon>
                </v-btn>
                <p class="text-right text-subtitle-1 font-weight-bold">
                    Serviços
                </p>
                <div class="justify-space-between">
                    <v-chip color="grey" outlined class="mb-3 mr-2">
                        Novas Solicitações: {{ users.new }}
                    </v-chip>
                    <v-chip color="grey" outlined class="mb-3 mr-2">
                        Solicitações Atendidas: {{ users.blocked }}
                    </v-chip>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" class="text-center">
            <span class="display-1">
                Página em Construção
            </span>
        </v-col>
    </v-row>
</template>

<script>
import AnalyticsService from '@/service/AnalyticsService';
export default {
    name: 'Home',
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
