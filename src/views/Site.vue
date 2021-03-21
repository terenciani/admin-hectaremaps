<template>
    <div>
        <v-row class="py-5">
            <v-col cols="12" md="6">
                <v-checkbox
                    v-model="editing"
                    :disabled="loadingDialog || editing"
                    label="Ativar Edição"
                ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6" class="text-center text-md-right">
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
                        <upload-image-site
                            area="hero"
                            :editing="editing"
                            :loading-dialog="loadingDialog"
                            :background-image="homeData.hero.background"
                            @onFinaly="init()"
                        ></upload-image-site>
                        <v-row>
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
                        <upload-image-site
                            area="service"
                            :editing="editing"
                            :loading-dialog="loadingDialog"
                            :background-image="homeData.service.background"
                            @onFinaly="init()"
                        ></upload-image-site>
                        <v-row>
                            <v-col cols="12">
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
                            <v-col cols="12">
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
                        <upload-image-site
                            area="video"
                            :editing="editing"
                            :loading-dialog="loadingDialog"
                            :background-image="homeData.video.background"
                            @onFinaly="init()"
                        ></upload-image-site>
                        <upload-video-site
                            :editing="editing"
                            :loading-dialog="loadingDialog"
                            :src="homeData.video.src"
                            @onFinaly="init()"
                        ></upload-video-site>
                        <v-row>
                            <v-col cols="12">
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

        <loading-dialog
            :active="loadingDialog"
            message="Aguarde! Os dados estão sendo enviados"
        />
        <default-snackbar
            :show="response.active"
            :type="response.type"
            :message="response.message"
            @close="response.active = false"
        />
    </div>
</template>

<script>
import DataService from '@/service/DataService';
import UploadImageSite from '@/components/UploadImageSite';
import UploadVideoSite from '@/components/UploadVideoSite';
import DefaultSnackbar from '@/components/DefaultSnackbar';
import LoadingDialog from '@/components/LoadingDialog';
export default {
    name: 'Site',
    components: {
        UploadImageSite,
        DefaultSnackbar,
        LoadingDialog,
        UploadVideoSite
    },
    data() {
        return {
            editing: false,
            loadingDialog: false,
            valid: true,
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
        async init() {
            this.editing = false;
            this.homeData = await DataService.getData();
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
        }
    }
};
</script>
