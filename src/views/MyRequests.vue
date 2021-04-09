<template>
    <div>
        <v-container v-if="list">
            <v-data-table
                :loading="loading"
                :headers="headers"
                :items="requests"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:top>
                    <v-container>
                        <v-row
                            align="center"
                            class="d-flex justify-space-between"
                        >
                            <v-col
                                cols="12"
                                sm="6"
                                md="3"
                                class="d-flex align-content-center"
                            >
                                <h3>Minhas Solicitações</h3>
                                <v-spacer></v-spacer>
                                <v-divider
                                    class="mx-4 d-none d-sm-flex"
                                    inset
                                    vertical
                                ></v-divider>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    class="pt-0"
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Procurar"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-col>
                            <v-col md="4" class="d-none d-md-flex">
                                <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    block
                                    large
                                    @click="list = false"
                                >
                                    Nova Solicitação
                                    <v-icon class="pl-5" dark>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-btn
                                v-show="$vuetify.breakpoint.smAndDown"
                                fab
                                dark
                                fixed
                                bottom
                                x-large
                                right
                                @click="list = false"
                                color="primary"
                            >
                                <v-icon>mdi-plus </v-icon>
                            </v-btn>
                        </v-row>
                    </v-container>
                </template>
                <template v-slot:[`item.create_at`]="{ item }">
                    {{ utilFormatter.formatDateISOToBR(item.create_at) }}
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                        class="ma-2"
                        outlined
                        :color="getColor(item.status)"
                    >
                        {{ getText(item.status) }}
                    </v-chip>
                </template>
                <template slot="footer" v-if="records > 0">
                    <v-container>
                        <strong> {{ footerText }} {{ records }} </strong>
                    </v-container>
                </template>
                <template slot="no-data" v-else>
                    <strong> {{ emptyRecordsText }} </strong>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                        v-if="item.status === 'FINISHED'"
                        :disabled="loading"
                        @click="download(item)"
                        color="success"
                        title="Baixar Relatório"
                        icon
                        large
                    >
                        <v-icon color="success">mdi-download</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="item.status === 'CREATED'"
                        :disabled="loading"
                        @click="cancel(item.id_request)"
                        color="error"
                        title="Cancelar Solicitação"
                        icon
                        large
                    >
                        <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                        :disabled="loading"
                        @click="view(item)"
                        color="info"
                        title="Visualizar Solicitação"
                        icon
                        large
                    >
                        <v-icon color="info">mdi-eye</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-container>
        <service-request @list="init" v-else></service-request>
        <confirm-dialog
            :show="dialogRedirect"
            :message="
                `Depois de finalizar você não poderá fazer alterações na solicitação!`
            "
            @confirm="$router.push('/myrequests')"
            @cancel="dialogRedirect = false"
        >
        </confirm-dialog>
        <v-snackbar v-model="message.active" :color="message.type">
            {{ message.text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    :class="message.type"
                    text
                    v-bind="attrs"
                    @click="message.active = false"
                >
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import ConfirmDialog from '../components/ConfirmDialog.vue';
import RequestService from '../service/RequestService';
import ServiceRequest from '../components/ServiceRequest.vue';
import UtilFormatter from '../utils/UtilFormatter';
export default {
    components: {
        ConfirmDialog,
        ServiceRequest
    },
    name: 'MyRequest',
    data() {
        return {
            list: true,
            dialogRedirect: false,
            footerText: 'Total de registros: ',
            search: '',
            utilFormatter: UtilFormatter,
            headers: [
                {
                    text: 'Código',
                    align: 'center',
                    value: 'id_request'
                },
                {
                    text: 'Data da Solicitação',
                    align: 'center',
                    value: 'create_at'
                },
                {
                    text: 'Status',
                    align: 'center',
                    value: 'status'
                },
                {
                    text: 'Ações',
                    align: 'center',
                    value: 'actions'
                }
            ],
            loading: false,
            emptyRecordsText: 'Nenhum registro encontrado',
            records: 0,
            requests: [],
            message: {
                text: '',
                type: '',
                active: false
            }
        };
    },
    methods: {
        async cancel(requestId) {
            if (!requestId) return;
            try {
                await RequestService.cancelRequest(requestId);
                this.init();
            } catch (error) {
                this.message = {
                    text:
                        'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error',
                    active: true
                };
                this.init();
            }
        },
        async init() {
            this.list = true;
            this.requests = await RequestService.getAllUserRequests();
        },
        getText(status) {
            switch (status) {
                case 'CREATED':
                    return 'Aguardando Processamento';
                case 'PROCESSING':
                    return 'Processando';
                case 'FINISHED':
                    return 'Arquivo Disponível';
                default:
                    return 'ERRO';
            }
        },
        getColor(status) {
            switch (status) {
                case 'CREATED':
                    return 'default';
                case 'PROCESSING':
                    return 'info';
                case 'FINISHED':
                    return 'success';
                default:
                    return 'error';
            }
        }
    },
    mounted() {
        this.init();
    }
};
</script>
