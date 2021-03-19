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
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    v-model="homeData.hero.title"
                                    label="Título da seção"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
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
import DataService from '@/service/DataService';
export default {
    name: 'Site',
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
