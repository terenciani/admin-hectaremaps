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
                            <v-col cols="12" sm="6" md="4" class="d-flex align-content-center">
                                <h3>Solicitações de Processamento</h3>
                                <v-spacer></v-spacer>
                                <v-divider class="mx-4 d-none d-sm-flex" inset vertical></v-divider>
                            </v-col>
                            <v-col cols="12" sm="6" md="8">
                                <v-text-field
                                    class="pt-0"
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Procurar"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-col>
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
                    <v-btn
                        :disabled="loading"
                        @click="openStatusEdit(item)"
                        color="warning"
                        title="Alterar Status"
                        icon
                        large
                    >
                        <v-icon color="warning">mdi-pencil-box-outline</v-icon>
                    </v-btn>
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
                        :disabled="loading"
                        :href="`${host}/request/zip/${item.id_request}`"
                        color="success"
                        title="Baixar Zip"
                        icon
                        large
                    >
                        <v-icon color="success">mdi-download</v-icon>
                    </v-btn>
                    <v-btn
                        :disabled="loading"
                        @click="openConfirmDialog(item.id_request)"
                        color="error"
                        title="Excluir Solicitação"
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
                    <v-btn
                        :disabled="loading"
                        @click="openAttachDialog(item)"
                        color="blue-grey"
                        title="Anexar Relatório"
                        icon
                        large
                    >
                        <v-icon color="blue-grey">mdi-paperclip</v-icon>
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
                                <h2 class="pb-2">Imagens enviadas</h2>
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
                                            :key="item"
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
        <v-dialog v-model="dialogStatus" max-width="400">
            <v-card shaped>
                <v-card-title class="text-center d-block">
                    <v-icon color="warning" large>mdi-alert-circle-outline</v-icon>
                    <p>Status da solicitação {{ request.id_request }}</p>
                </v-card-title>
                <v-card-text class="text-justify">
                    Após a alteração, o novo status ficará disponível para o cliente.
                    <v-select
                        v-model="request.status"
                        :items="statusItems"
                        item-text="text"
                        item-value="value"
                    >
                    </v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="init" color="error" text>
                        Cancelar
                    </v-btn>
                    <v-btn color="success lighten-1" text @click="updateRequest">
                        Confirmar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogAttach" max-width="400">
            <v-card shaped>
                <v-card-title class="text-center d-block">
                    <v-icon color="warning" large>mdi-alert-circle-outline</v-icon>
                    <p>Relatório da solicitação {{ request.id_request }}</p>
                </v-card-title>
                <v-card-text class="text-justify">
                    O arquivo ficará disponível para o cliente somente quando o status for alterado
                    para "Arquivo Disponível".
                    <a
                        v-if="request.status == 'FINISHED' || request.status == 'ATTACHED'"
                        :href="`${host}/upload/request/${request.id_request}/report.pdf`"
                        target="_blank"
                        style="text-decoration: none"
                    >
                        <v-chip class="mt-4" color="success" outlined>
                            <v-icon left>
                                mdi-download
                            </v-icon>
                            Visualizar relatório anexado.
                        </v-chip>
                    </a>

                    <v-file-input
                        class="mt-5"
                        :label="
                            request.status == 'FINISHED' ? 'Alterar Relatório' : 'Anexar relatório'
                        "
                        outlined
                        accept="application/pdf"
                        prepend-icon="mdi-file"
                        @change="selectFile"
                    ></v-file-input>

                    <v-progress-linear
                        v-model="progress"
                        v-if="currentFile"
                        color="light-blue"
                        height="25"
                        reactive
                    >
                        <strong>{{ progress }} %</strong>
                    </v-progress-linear>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="init" color="error" text>
                        Cancelar
                    </v-btn>
                    <v-btn color="success lighten-1" text @click="uploadReport">
                        Confirmar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import config from './../../config';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import RequestService from '../service/RequestService';
import UploadService from '../service/UploadService';
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
            dialogStatus: false,
            dialogRedirect: false,
            dialogRemove: false,
            dialogAttach: false,
            viewDialog: false,
            footerText: 'Total de registros: ',
            search: '',
            progress: 0,
            host: config.apiHost,
            currentFile: undefined,
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
            statusItems: [
                {
                    text: 'Aguardando Processamento',
                    value: 'CREATED'
                },
                {
                    text: 'Processando',
                    value: 'PROCESSING'
                },
                {
                    text: 'Arquivo Disponível',
                    value: 'FINISHED'
                },
                {
                    text: 'Produzindo Relatório',
                    value: 'ATTACHED'
                }
            ],
            requests: [],
            request: {},
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
        uploadReport() {
            if (!this.currentFile) {
                this.message = {
                    text: 'Por favor, selecione um arquivo PFD!',
                    type: 'error',
                    active: true
                };
                return;
            }
            UploadService.uploadReport(this.currentFile, this.request.id_request, event => {
                this.progress = Math.round((100 * event.loaded) / event.total);
            })
                .then(() => {
                    this.message = {
                        text: 'Relatório enviado com sucesso!',
                        type: 'success',
                        active: true
                    };
                    this.init();
                })
                .catch(() => {
                    this.progress = 0;
                    this.message = {
                        text: 'Não foi possível enviar o relatório. Tente mais tarde!',
                        type: 'error',
                        active: true
                    };
                    this.init();
                });
        },
        selectFile(file) {
            this.progress = 0;
            this.currentFile = file;
        },
        async view(request) {
            this.requestData = await RequestService.getRequestData(request.id_request);
            this.viewDialog = true;
        },
        openAttachDialog(request) {
            this.request = request;
            this.dialogAttach = true;
        },
        openStatusEdit(request) {
            this.request = request;
            this.dialogStatus = true;
        },
        openConfirmDialog(requestId) {
            this.requestId = requestId;
            this.dialogRemove = true;
        },
        async updateRequest() {
            if (!this.request.id_request) return;
            try {
                if (this.request.id_request) {
                    await RequestService.update(this.request);
                    this.message = {
                        text: 'Alteração realizada com sucesso',
                        type: 'success'
                    };
                }
            } catch (error) {
                this.message = {
                    text: 'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error'
                };
            } finally {
                this.init();
                this.message.active = true;
            }
        }, // save()
        async cancel() {
            if (!this.requestId) return;
            try {
                await RequestService.cancelRequest(this.requestId);
                this.message = {
                    text: 'Requisição excluida com sucesso',
                    type: 'success'
                };
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
            try {
                this.loading = true;
                this.requests = await RequestService.getAllRequests();
                this.list = true;
                this.dialogRedirect = false;
                this.dialogRemove = false;
                this.dialogStatus = false;
                this.dialogAttach = false;
                this.progress = 0;
                this.currentFile = undefined;
                this.requestId = undefined;
                this.request = {};
                this.requestData = this.requestDataDefault;
            } catch (error) {
                this.message = {
                    text: 'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error',
                    active: true
                };
            } finally {
                this.loading = false;
            }
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
