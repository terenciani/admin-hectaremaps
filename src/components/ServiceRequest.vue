<template>
    <v-container>
        <div v-if="selectedImages.length > 0">
            <v-progress-linear v-model="percentOfSend" color="light-blue" height="25" reactive>
                <strong>Progresso total: {{ percentOfSend.toFixed() }} %</strong>
            </v-progress-linear>
        </div>
        <div v-if="selectedImages.length > 0" class="mt-3">
            <v-progress-linear
                v-model="individualPercentOfSend"
                color="light-blue"
                height="25"
                reactive
            >
                <strong>Progresso individual: {{ individualPercentOfSend }} %</strong>
            </v-progress-linear>
        </div>
        <v-row v-if="!planContracted.id_plan_contract">
            <v-col cols="12">
                <v-alert dismissible dense outlined type="info">
                    <v-row align="center">
                        <v-col class="grow">
                            Você não possui nenhum plano contratado! Para realizar essa operação
                            você precisar contratar!
                        </v-col>
                        <v-col class="shrink">
                            <v-btn to="/plancontract" text>Contratar Plano</v-btn>
                        </v-col>
                    </v-row>
                </v-alert>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-stepper v-model="stepper">
                    <v-stepper-header>
                        <v-stepper-step :complete="stepper > 1" step="1">
                            Detalhes da Solicitação
                        </v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="stepper > 2" step="2">
                            Selecionar Imagens
                        </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-card>
                                <v-row class="px-5">
                                    <v-col cols="12" class="mt-2">
                                        <v-text-field
                                            outlined
                                            v-model="description"
                                            label="Descrição"
                                        ></v-text-field>
                                        <h3>Selecione os serviços</h3>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                        lg="3"
                                        v-for="service in services"
                                        :key="service.id_item_plan"
                                    >
                                        <v-checkbox
                                            v-model="selectedServices"
                                            :label="service.description"
                                            :value="service.id_item_plan"
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" class="text-right">
                                        <v-btn
                                            @click="$router.push('/')"
                                            color="error"
                                            class="mr-5"
                                            text
                                        >
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="primary" text @click="createRequest()">
                                            Próximo
                                            <v-icon class="mr-3">mdi-chevron-double-right</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                            <v-card>
                                <v-row no-gutters justify="center" align="center">
                                    <v-col cols="8">
                                        <v-file-input
                                            accept="image/*, .zip, .rar, .7zip"
                                            multiple
                                            show-size
                                            label="Selecione as imagens (png, jpg, jpeg, zip, rar, 7zip)"
                                            @change="selectImages"
                                        ></v-file-input>
                                    </v-col>
                                    <v-col cols="4" class="pl-5">
                                        <v-btn
                                            color="success"
                                            dark
                                            block
                                            large
                                            :disabled="!allowUpload"
                                            @click="uploadImages"
                                        >
                                            Enviar Imagens
                                            <v-icon right dark>mdi-cloud-upload</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12" v-if="imagesNames.length > 0">
                                        <h2 class="pb-2">
                                            Imagens enviadas ({{ imagesNames.length }}/{{
                                                selectedImages.length
                                            }})
                                        </h2>
                                        <v-virtual-scroll
                                            :items="imagesNames"
                                            height="200"
                                            item-height="35"
                                        >
                                            <template v-slot:default="{ item }">
                                                <a
                                                    :href="
                                                        `${host}/upload/request/${requestId}/${item.filename}`
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
                                <v-row>
                                    <v-col cols="12" class="text-right">
                                        <v-btn @click="cancel()" color="error" class="mr-5" text>
                                            Cancelar
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            text
                                            :disabled="!allowFinish"
                                            @click="dialogRedirect = true"
                                        >
                                            Finalizar
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-col>
        </v-row>
        <confirm-dialog
            :show="dialogConfirm"
            :message="`Você já possui solicitações abertas! `"
            @confirm="dialogConfirm = false"
            @cancel="$emit('list')"
        >
        </confirm-dialog>
        <confirm-dialog
            :show="dialogRedirect"
            :message="`Depois de finalizar você não poderá fazer alterações na solicitação!`"
            @confirm="$emit('list')"
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
    </v-container>
</template>

<script>
import config from './../../config';
import ContractService from './../service/ContractService';
import RequestService from './../service/RequestService';
import PlanService from './../service/PlanService';
import UploadService from './../service/UploadService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
export default {
    components: {
        ConfirmDialog
    },
    name: 'ServiceRequest',
    data() {
        return {
            dialogRedirect: false,
            host: config.apiHost,
            stepper: 1,
            dialogConfirm: false,
            planContracted: {},
            services: [],
            selectedServices: [],
            selectedImages: [],
            imageInfos: [],
            requestId: {},
            description: '',
            imagesNames: [],
            percentOfSend: 0,
            individualPercentOfSend: 0,
            uploading: false,
            uploaded: false,
            total: 0,
            timeSpent: 0,
            message: {
                text: '',
                type: '',
                active: false
            }
        };
    },
    computed: {
        allowUpload() {
            if (this.uploading) return false;
            if (!this.selectedImages || this.selectedImages.length <= 0) return false;
            return true;
        },
        allowFinish() {
            if (!this.uploaded) return false;
            if (!this.selectedImages || this.selectedImages.length <= 0) return false;
            return true;
        }
    },
    methods: {
        async createRequest() {
            if (!this.selectedServices.length > 0) {
                this.message = {
                    text: 'Selecione ao menos um serviço',
                    type: 'error',
                    active: true
                };
                return;
            }
            try {
                this.requestId = await RequestService.createRequest(
                    this.selectedServices,
                    this.planContracted,
                    this.description
                );
                this.stepper = 2;
            } catch (error) {
                this.message = {
                    text: 'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error',
                    active: true
                };
                this.init();
            }
        },
        async cancel() {
            if (!this.requestId) return;
            try {
                await RequestService.cancelRequest(this.requestId);
                this.$router.push('/');
            } catch (error) {
                this.message = {
                    text: 'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error',
                    active: true
                };
                this.init();
            }
        },
        selectImages(images) {
            this.selectedImages = images;
        },
        async uploadImages() {
            let startedAs = Date.now();
            this.timeSpent = 0;
            try {
                this.uploading = true;
                this.message = {
                    text: '',
                    type: '',
                    active: false
                };
                const requestPromise = this.selectedImages.map(this.upload);
                await Promise.allSettled(requestPromise);
            } catch (error) {
                this.message = {
                    text: 'Pode ter acontecido erros ao enviar os arquivos!',
                    type: 'error',
                    active: true
                };
            } finally {
                this.message = {
                    text: 'Arquivos enviados com sucesso!',
                    type: 'success',
                    active: true
                };
                this.timeSpent = Date.now() - startedAs;
                console.log('Tempo gasto: ' + (this.timeSpent / 1000).toFixed(3));
                this.uploaded = true;
            }
        },
        async upload(file) {
            await UploadService.serviceRequest(file, this.requestId, event => {
                this.total = event.total;
                this.individualPercentOfSend = Math.round((100 * event.loaded) / event.total);
            })
                .then(response => {
                    //this.timeSpent += response.config.meta.timeSpent;
                    this.imagesNames.push(response.data);
                    this.percentOfSend =
                        (this.imagesNames.length * 100) / this.selectedImages.length;
                })
                .catch(() => {
                    this.message = {
                        text: 'Não foi possível enviar a imagem. Tente mais tarde!',
                        type: 'error',
                        active: true
                    };
                });
        },
        async init() {
            this.stepper = 1;
            this.description = '';
            this.services = [];
            this.total = 0;
            this.uploading = false;
            this.uploaded = false;
            this.percentOfSend = 0;
            this.individualPercentOfSend = 0;
            try {
                this.planContracted = await ContractService.getContractCurrentByUser();
                if (this.planContracted.id_plan_contract) {
                    this.services = await PlanService.getItemsByPlan(this.planContracted.fk_plan);
                    this.requests = await RequestService.getRequestActivesByUser();
                    if (this.requests.length > 0) this.dialogConfirm = true;
                }
            } catch (error) {
                this.message = {
                    text: 'Algo inesperado aconteceu!',
                    type: 'error',
                    active: true
                };
            } finally {
                this.message.active = false;
            }
        }
    },
    async mounted() {
        this.init();
    }
};
</script>
