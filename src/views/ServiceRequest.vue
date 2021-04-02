<template>
    <v-container>
        <div v-if="progressInfos">
            <div
                class="mb-2"
                v-for="(progressInfo, index) in progressInfos"
                :key="index"
            >
                <span>{{ progressInfo.fileName }}</span>
                <v-progress-linear
                    v-model="progressInfo.percentage"
                    color="light-blue"
                    height="25"
                    reactive
                >
                    <strong>{{ progressInfo.percentage }} %</strong>
                </v-progress-linear>
            </div>
        </div>
        <v-row v-if="!planContracted.id_plan_contract">
            <v-col cols="12">
                <v-alert dismissible dense outlined type="info">
                    <v-row align="center">
                        <v-col class="grow">
                            Você não possui nenhum plano contratado! Para
                            realizar essa operação você precisar contratar!
                        </v-col>
                        <v-col class="shrink">
                            <v-btn to="/plancontract" text
                                >Contratar Plano</v-btn
                            >
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
                            Selecionar Serviços
                        </v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="stepper > 2" step="2">
                            Selecionar Imagens
                        </v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step step="3">
                            Confirmar Solicitação
                        </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-card>
                                <v-row>
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
                                        <v-btn
                                            color="primary"
                                            text
                                            @click="createRequest()"
                                        >
                                            Próximo
                                            <v-icon class="mr-3"
                                                >mdi-chevron-double-right</v-icon
                                            >
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                            <v-card>
                                <v-row
                                    no-gutters
                                    justify="center"
                                    align="center"
                                >
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
                                            @click="uploadImages"
                                        >
                                            Enviar Imagens
                                            <v-icon right dark
                                                >mdi-cloud-upload</v-icon
                                            >
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card
                                            v-if="imagesNames.length > 0"
                                            class="mx-auto"
                                        >
                                            <v-list>
                                                <v-subheader
                                                    >Lista de Arquivos
                                                    Enviados</v-subheader
                                                >
                                                <v-list-item-group
                                                    color="primary"
                                                >
                                                    <v-list-item
                                                        v-for="(file,
                                                        index) in imagesNames"
                                                        :key="index"
                                                    >
                                                        <v-list-item-content>
                                                            <v-list-item-title
                                                                class="mb-3"
                                                            >
                                                                <a
                                                                    :href="
                                                                        file.url
                                                                    "
                                                                    >{{
                                                                        file.name
                                                                    }}</a
                                                                >
                                                            </v-list-item-title>
                                                            <v-list-item-subtitle>
                                                                <img
                                                                    :src="
                                                                        file.url
                                                                    "
                                                                    :alt="
                                                                        file.name
                                                                    "
                                                                    height="80px"
                                                                />
                                                            </v-list-item-subtitle>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" class="text-right">
                                        <v-btn
                                            @click="cancel()"
                                            color="error"
                                            class="mr-5"
                                            text
                                        >
                                            Cancelar
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            text
                                            @click="createRequest()"
                                        >
                                            Próximo
                                            <v-icon class="mr-3"
                                                >mdi-chevron-double-right</v-icon
                                            >
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-stepper-content>

                        <v-stepper-content step="3">
                            <v-card
                                class="mb-12"
                                color="grey lighten-1"
                                height="200px"
                            ></v-card>

                            <v-btn color="primary" @click="stepper = 1">
                                Continue
                            </v-btn>

                            <v-btn text>
                                Cancel
                            </v-btn>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-col>
        </v-row>
        <default-snackbar
            :show="message.active"
            :type="message.type"
            :message="message.text"
            @close="message.active = false"
        ></default-snackbar>
        <confirm-dialog
            :show="dialogConfirm"
            :message="`Você já possui solicitações abertas! `"
            @confirm="dialogConfirm = false"
            @cancel="$router.push('/myrequests')"
        >
        </confirm-dialog>
    </v-container>
</template>

<script>
import ContractService from './../service/ContractService';
import RequestService from './../service/RequestService';
import PlanService from './../service/PlanService';
import UploadService from './../service/UploadService';
import DefaultSnackbar from './../components/DefaultSnackbar';
import ConfirmDialog from '../components/ConfirmDialog.vue';
export default {
    components: {
        DefaultSnackbar,
        ConfirmDialog
    },
    name: 'ServiceRequest',
    data() {
        return {
            stepper: 1,
            dialogConfirm: false,
            planContracted: {},
            services: [],
            selectedServices: [],
            selectedImages: undefined,
            progressInfos: [],
            imageInfos: [],
            requestId: {},
            imagesNames: [],
            message: {
                text: '',
                type: '',
                active: false
            }
        };
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
                    this.planContracted
                );
                this.stepper = 2;
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
        selectImages(images) {
            this.progressInfos = [];
            this.selectedImages = images;
        },
        uploadImages() {
            this.message = {
                text: '',
                type: '',
                active: false
            };

            for (let i = 0; i < this.selectedImages.length; i++) {
                this.upload(i, this.selectedImages[i]);
            }
        },
        upload(index, file) {
            this.progressInfos[index] = { percentage: 0, fileName: file.name };

            UploadService.serviceRequest(file, this.requestId, event => {
                this.progressInfos[index].percentage = Math.round(
                    (100 * event.loaded) / event.total
                );
            })
                .then(response => {
                    console.log(response);
                    this.message = {
                        text: 'Arquivos enviados com sucesso!',
                        type: 'success',
                        active: true
                    };
                    return RequestService.getRequestImages(this.requestId);
                })
                .then(images => {
                    this.imagesNames = images;
                })
                .catch(() => {
                    this.progressInfos[index].percentage = 0;
                    this.message = {
                        text:
                            'Não foi possível enviar a imagem. Tente mais tarde!',
                        type: 'error',
                        active: true
                    };
                });
        },
        async init() {
            this.stepper = 1;
            this.services = [];
            try {
                this.planContracted = await ContractService.getContractCurrentByUser();
                if (this.planContracted.id_plan_contract) {
                    this.services = await PlanService.getItemsByPlan(
                        this.planContracted.fk_plan
                    );
                    this.requests = await RequestService.getRequestActivesByUser();
                    if (this.requests.length > 0) this.dialogConfirm = true;
                }
            } catch (error) {
                console.log('Algo inesperado aconteceu');
            }
        }
    },
    async mounted() {
        this.init();
    }
};
</script>
