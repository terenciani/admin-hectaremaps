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
                        <v-row align="center" class="d-flex justify-space-between">
                            <v-col cols="12" sm="6" md="3" class="d-flex align-content-center">
                                <h3>Minhas Solicitações</h3>
                                <v-spacer></v-spacer>
                                <v-divider class="mx-4 d-none d-sm-flex" inset vertical></v-divider>
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
                <template v-slot:[`item.update_at`]="{ item }">
                    {{ utilFormatter.formatDateISOToBR(item.update_at) }}
                </template>
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip class="ma-2" outlined :color="getColor(item.status)">
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
                        :href="`${host}/upload/request/${item.id_request}/report.pdf`"
                        :disabled="loading"
                        color="success"
                        target="_blank"
                        title="Abrir Relatório"
                        icon
                        large
                    >
                        <v-icon color="success">mdi-download</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="item.status === 'CREATED'"
                        :disabled="loading"
                        @click="openConfirmDialog(item.id_request)"
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
            :message="`Depois de finalizar você não poderá fazer alterações na solicitação!`"
            @confirm="$router.push('/myrequests')"
            @cancel="dialogRedirect = false"
        >
        </confirm-dialog>
        <confirm-dialog
            :show="dialogRemove"
            :message="
                `A solicitação de código <span class='font-weight-bold'>${requestId}</span> será removida e essa ação não poderá ser desfeita.`
            "
            @confirm="cancel()"
            @cancel="
                dialogRemove = false;
                requestId = undefined;
            "
        >
        </confirm-dialog>
        <v-snackbar v-model="message.active" :color="message.type">
            {{ message.text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    :class="message.type"
                    text
                    v-bind="attrs"
                    @click="
                        message = {
                            active: false
                        }
                    "
                >
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
        <v-dialog v-model="viewDialog" v-if="requestData && requestData.id_request">
            <v-card>
                <v-toolbar color="teal" dark>
                    Solicitação {{ requestData.id_request }}
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="viewDialog = false">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pb-0">
                    <v-container class="text-subtitle-1">
                        <v-row>
                            <v-col cols="12" md="6">
                                <h2 class="pb-2">Dados da Solicitação</h2>
                                <strong>Código:</strong>
                                {{ requestData.id_request }} <br />
                                <strong>Criado em:</strong>
                                {{ utilFormatter.formatDateISOToBR(requestData.create_at) }}
                                <br />
                                <strong>Status:</strong>
                                {{ getText(requestData.status) }}
                                <br />
                                <strong>Descrição:</strong>
                                {{ requestData.description }}
                                <v-divider class="my-3" />
                                <h2 class="pb-2">Serviços solicitados</h2>
                                <v-virtual-scroll
                                    :items="requestData.services"
                                    height="200"
                                    item-height="35"
                                >
                                    <template v-slot:default="{ item }">
                                        <span>
                                            {{ item.description }}
                                        </span>
                                    </template>
                                </v-virtual-scroll>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-divider class="mb-3" v-if="$vuetify.breakpoint.smAndDown" />
                                <h2 class="pb-2">Usuário</h2>
                                <strong>Nome: </strong>
                                {{ requestData.user.name }}
                                {{ requestData.user.lastname }} <br />
                                <strong>E-mail:</strong>
                                {{ requestData.user.email }}
                                <br />
                                <strong>Telefone:</strong>
                                {{ utilFormatter.formatPhone(requestData.user.phone) }}

                                <v-divider class="my-3" />
                                <h2 class="pb-2">
                                    Imagens enviadas ({{ requestData.images.length }})
                                </h2>
                                <v-virtual-scroll
                                    :items="requestData.images"
                                    height="200"
                                    item-height="35"
                                >
                                    <template v-slot:default="{ item }">
                                        <a
                                            :href="
                                                `${host}/upload/request/${requestData.id_request}/${item.filename}`
                                            "
                                            target="_blank"
                                            style="text-decoration: none"
                                            :key="item.filename"
                                        >
                                            <v-chip class="ma-2" color="success" outlined>
                                                <v-icon left>
                                                    mdi-eye
                                                </v-icon>

                                                {{ item.filename }}
                                            </v-chip>
                                        </a>
                                    </template>
                                </v-virtual-scroll>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions bottom>
                    <v-container class="text-right">
                        <v-btn @click="viewDialog = false" text color="error">
                            Fechar
                        </v-btn>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import config from './../../config';
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
            dialogRemove: false,
            viewDialog: false,
            footerText: 'Total de registros: ',
            search: '',
            host: config.apiHost,
            utilFormatter: UtilFormatter,
            headers: [
                {
                    text: 'Código',
                    align: 'center',
                    value: 'id_request'
                },
                {
                    text: 'Descrição',
                    align: 'center',
                    value: 'description'
                },
                {
                    text: 'Data da Solicitação',
                    align: 'center',
                    value: 'create_at'
                },
                {
                    text: 'Última Atualização',
                    align: 'center',
                    value: 'update_at'
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
            requestId: undefined,
            requestData: undefined,
            requestDataDefault: {
                user: {
                    name: ''
                },
                services: [],
                images: []
            },
            message: {
                text: '',
                type: '',
                active: false
            }
        };
    },
    methods: {
        async view(request) {
            this.requestData = await RequestService.getRequestData(request.id_request);
            this.viewDialog = true;
        },
        openConfirmDialog(requestId) {
            this.requestId = requestId;
            this.dialogRemove = true;
        },
        async cancel() {
            if (!this.requestId) return;
            try {
                await RequestService.cancelRequest(this.requestId);
                this.message = {
                    text: 'Requisição excluida com sucesso',
                    type: 'success'
                };
                this.init();
            } catch (error) {
                this.message = {
                    text: 'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error'
                };
            } finally {
                this.init();
                this.message.active = true;
            }
        },
        async init() {
            this.list = true;
            this.viewDialog = false;
            this.dialogRedirect = false;
            this.dialogRemove = false;
            this.requestId = undefined;
            this.requestData = this.requestDataDefault;
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
                case 'ATTACHED':
                    return 'Produzindo relatório';
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
                case 'ATTACHED':
                    return 'warning';
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
