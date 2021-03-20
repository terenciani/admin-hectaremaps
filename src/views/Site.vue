<template>
    <div>
        <v-row class="py-5">
            <v-col cols="6">
                <v-checkbox
                    v-model="editing"
                    :disabled="loadingDialog || editing"
                    label="Ativar Edição"
                ></v-checkbox>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn
                    outlined
                    large
                    :disabled="loadingDialog || !editing"
                    :loading="loadingDialog"
                    dark
                    class="mr-5"
                    color="error"
                    @click="init"
                >
                    <v-icon left>
                        mdi-cancel
                    </v-icon>
                    Cancelar
                </v-btn>
                <v-btn
                    tile
                    large
                    :disabled="loadingDialog || !editing"
                    :loading="loadingDialog"
                    dark
                    color="primary"
                    @click="save"
                >
                    <v-icon left>
                        mdi-content-save-outline
                    </v-icon>
                    Salvar
                </v-btn>
            </v-col>
        </v-row>
        <v-form ref="form" v-model="valid">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Seção Principal</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-img
                                    :src="
                                        `${host}/assets/${homeData.hero.background}`
                                    "
                                    max-width="500"
                                    max-height="300"
                                >
                                    <template v-slot:placeholder>
                                        <v-row
                                            class="fill-height ma-0"
                                            align="center"
                                            justify="center"
                                        >
                                            <v-progress-circular
                                                indeterminate
                                                color="grey lighten-5"
                                            ></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                                md="9"
                                class="d-flex align-center"
                            >
                                <v-row>
                                    <v-col cols="12" v-if="!alterHeroImage">
                                        <v-btn
                                            class="teal white--text"
                                            large
                                            block
                                            :disabled="
                                                loadingDialog || !editing
                                            "
                                            @click="alterHeroImage = true"
                                        >
                                            Alterar Imagem
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12" v-else>
                                        <v-row class="pb-5">
                                            <v-col
                                                cols="12"
                                                md="9"
                                                class="pb-0"
                                            >
                                                <v-file-input
                                                    label="Imagem de fundo principal"
                                                    outlined
                                                    accept="image/*"
                                                    prepend-icon="mdi-camera"
                                                    :disabled="
                                                        loadingDialog ||
                                                            !editing
                                                    "
                                                    @change="selectFile"
                                                ></v-file-input>
                                            </v-col>
                                            <v-col
                                                cols="12"
                                                md="2"
                                                class="pb-0"
                                            >
                                                <v-btn
                                                    color="success"
                                                    large
                                                    block
                                                    :disabled="
                                                        loadingDialog ||
                                                            !editing ||
                                                            !currentFile
                                                    "
                                                    @click="upload('hero')"
                                                >
                                                    Atualizar
                                                    <v-icon right dark
                                                        >mdi-cloud-upload</v-icon
                                                    >
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12" v-if="currentFile">
                                        <v-progress-linear
                                            v-model="progress"
                                            color="light-blue"
                                            height="25"
                                            reactive
                                        >
                                            <strong>{{ progress }} %</strong>
                                        </v-progress-linear>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.hero.title"
                                    label="Título da seção"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.hero.subtitle"
                                    label="Subtítulo da seção"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Seção Quem Somos</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.about.title"
                                    label="Título da seção"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-textarea
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.about.paragraph_one"
                                    label="Primeiro parágrafo"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-textarea
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.about.paragraph_two"
                                    label="Segundo parágrafo"
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Seção Serviços</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.service.title"
                                    label="Título da seção"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Seção Planos</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.plan.title"
                                    label="Título da seção"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Seção Vídeo</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.video.title"
                                    label="Título da seção"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Seção Contato</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    v-model="homeData.contact.title"
                                    label="Título da seção"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    type="email"
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    v-model="homeData.contact.email"
                                    label="E-mail para contato"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    v-model="homeData.contact.address"
                                    label="Endereço da empresa"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    v-mask="mask"
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    placeholder="(99) 9 9999-9999"
                                    v-model="homeData.contact.phone"
                                    label="Telefone de contato"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.contact.facebook"
                                    label="Link do Facebook (opcional)"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.contact.instagram"
                                    label="Link do Instagram (opcional)"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.contact.twitter"
                                    label="Link do Twitter (opcional)"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.contact.pinterest"
                                    label="Link do Pinterest (opcional)"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-form>

        <v-dialog v-model="loadingDialog" hide-overlay persistent width="350">
            <v-card color="primary" dark>
                <v-card-text>
                    <v-card-text>
                        Aguarde! Seu e-mail está sendo enviado!</v-card-text
                    >
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="response.active" :color="response.type">
            {{ response.message }}

            <template v-slot:action="{ attrs }">
                <v-btn
                    :class="response.type"
                    text
                    v-bind="attrs"
                    @click="response.active = false"
                >
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import config from './../../config';
import DataService from '@/service/DataService';
import UploadService from '@/service/UploadService';
export default {
    name: 'Site',
    data() {
        return {
            editing: false,
            host: config.apiHost,
            alterHeroImage: false,
            loadingDialog: false,
            valid: true,
            fileInfos: [],
            currentFile: undefined,
            progress: 0,
            requiredField: v => !!v || 'Este campo é obrigatório',
            mask: [
                '(',
                /\d/,
                /\d/,
                ') ',
                /\d/,
                ' ',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/
            ],
            homeData: {
                hero: {},
                about: {},
                service: {},
                plan: {},
                video: {},
                contact: {}
            },
            response: {
                message: '',
                type: 'success',
                active: false
            }
        };
    },
    async mounted() {
        this.init();
    },
    methods: {
        selectFile(file) {
            this.progress = 0;
            this.currentFile = file;
        },
        async init() {
            this.editing = false;
            this.homeData = await DataService.getData();
            this.alterHeroImage = false;
            this.currentFile = undefined;
        },
        async save() {
            if (!this.$refs.form.validate()) {
                this.response.message =
                    'Todos os campos em vermelho são obrigatórios';
                this.response.type = 'error';
                this.response.active = true;
                return;
            }
            this.loadingDialog = true;
            try {
                this.response.message = await DataService.setData(
                    this.homeData
                );
                this.response.type = 'success';
                this.$refs.form.resetValidation();
                this.$refs.form.reset();
                this.init();
            } catch (error) {
                this.response.message = error;
                this.response.type = 'error';
            } finally {
                this.loadingDialog = false;
                this.response.active = true;
            }
        },
        upload(area) {
            if (!this.currentFile) {
                this.response = {
                    message: 'Por favor, selecione uma imagem!',
                    type: 'error',
                    active: true
                };
                return;
            }
            UploadService.upload(this.currentFile, area, event => {
                this.progress = Math.round((100 * event.loaded) / event.total);
            })
                .then(() => {
                    this.response = {
                        message: 'Imagem enviada com sucesso!',
                        type: 'success',
                        active: true
                    };
                    this.init();
                })
                .catch(() => {
                    this.progress = 0;
                    this.response = {
                        message:
                            'Não foi possível enviar a imagem. Tente mais tarde!',
                        type: 'error',
                        active: true
                    };
                    this.currentFile = undefined;
                });
        }
    }
};
</script>
