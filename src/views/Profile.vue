<template>
    <div>
        <v-row v-if="user.id_user">
            <v-col cols="12" sm="4" class="mb-xs-0">
                <v-checkbox
                    v-model="editing"
                    :disabled="loadingDialog || editing"
                    label="Ativar Edição"
                ></v-checkbox>
            </v-col>
            <v-col
                cols="12"
                sm="8"
                class="text-center text-sm-right"
                v-if="editing"
            >
                <v-btn
                    outlined
                    large
                    :disabled="loadingDialog || !editing"
                    :loading="loadingDialog"
                    dark
                    class="mr-5 mb-5"
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
                    class="mb-5"
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
        <v-form ref="form" v-model="valid" v-if="user.id_user">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Dados Pessoais</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.name"
                                    label="Nome"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.lastname"
                                    label="Sobrenome"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    v-mask="phoneMask"
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    required
                                    placeholder="(99) 9 9999-9999"
                                    v-model="user.phone"
                                    label="Telefone"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    v-mask="cpfMask"
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    required
                                    placeholder="999.999.999-99"
                                    v-model="user.cpf"
                                    label="CPF"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    outlined
                                    type="email"
                                    disabled
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.email"
                                    label="E-mail"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-btn
                                    color="warning"
                                    x-large
                                    block
                                    outlined
                                    @click="
                                        updateEmailDialog = true;
                                        newEmail = '';
                                    "
                                    :disabled="loadingDialog || !editing"
                                >
                                    <v-icon class="mr-5">
                                        mdi-email
                                    </v-icon>
                                    Alterar E-mail
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        >Endereço</v-expansion-panel-header
                    >
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field
                                    outlined
                                    v-mask="cepMask"
                                    :disabled="loadingDialog || !editing"
                                    :rules="[requiredField]"
                                    required
                                    placeholder="99.999-999"
                                    v-model="user.cep"
                                    @blur="searchCEP"
                                    label="CEP"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    outlined
                                    :disabled="
                                        loadingDialog || !editing || !user.cep
                                    "
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.address"
                                    label="Logradouro"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field
                                    outlined
                                    :disabled="
                                        loadingDialog || !editing || !user.cep
                                    "
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.number"
                                    label="Número"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    outlined
                                    :disabled="
                                        loadingDialog || !editing || !user.cep
                                    "
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.complement"
                                    label="Complemento"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    outlined
                                    :disabled="
                                        loadingDialog || !editing || !user.cep
                                    "
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.district"
                                    label="Bairro"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    outlined
                                    disabled
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.city"
                                    label="Cidade"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field
                                    outlined
                                    disabled
                                    :rules="[requiredField]"
                                    required
                                    v-model="user.uf"
                                    label="Estado"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-form>
        <v-dialog
            v-model="updateEmailDialog"
            transition="dialog-transition"
            max-width="400"
        >
            <v-card shaped>
                <v-card-title class="text-center d-block">
                    <v-icon color="warning" large
                        >mdi-alert-circle-outline</v-icon
                    >
                    <p>Tem certeza disso?</p>
                </v-card-title>
                <v-form ref="formEmail" v-model="validEmail">
                    <v-card-text class="text-justify">
                        <v-text-field
                            outlined
                            type="email"
                            :rules="emailRules"
                            required
                            v-model="newEmail"
                            label="Novo e-mail"
                        ></v-text-field>
                        <v-alert
                            type="warning"
                            outlined
                            dismissible
                            :value="true"
                        >
                            Será enviado um e-mail de confirmação antes da troca
                            ser efetivada.
                        </v-alert>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="init" color="error" text>
                            Cancelar
                        </v-btn>
                        <v-btn
                            color="success lighten-1"
                            text
                            @click="updateEmail"
                        >
                            Confirmar
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <loading-dialog
            :active="loadingDialog"
            message="Aguarde! Os dados estão sendo enviados"
        />
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
import UserService from '../service/UserService';
import LoadingDialog from '@/components/LoadingDialog';
export default {
    name: 'Profile',
    components: {
        LoadingDialog
    },
    data() {
        return {
            updateEmailDialog: false,
            newEmail: '',
            user: {
                address: '',
                complement: '',
                district: '',
                city: '',
                uf: ''
            },
            editing: false,
            valid: true,
            validEmail: true,
            loadingDialog: false,
            response: {
                message: '',
                type: 'success',
                active: false
            },
            requiredField: v => !!v || 'Este campo é obrigatório',
            phoneMask: [
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
            cpfMask: [
                /\d/,
                /\d/,
                /\d/,
                '.',
                /\d/,
                /\d/,
                /\d/,
                '.',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/
            ],
            cepMask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
            emailRules: [
                v => !!v || 'O e-mail é obrigatório',
                v => /.+@.+\..+/.test(v) || 'Informe um e-mail válido.'
            ],
            cepData: {}
        };
    },
    methods: {
        async updateEmail() {
            if (!this.$refs.formEmail.validate()) return;
            try {
                let resp = await UserService.updateEmail(this.newEmail);
                if (resp.status == 422) {
                    this.response = {
                        message: resp.message,
                        type: 'error',
                        active: true
                    };
                } else {
                    this.response = {
                        message: resp.message,
                        type: 'info',
                        active: true
                    };
                    this.$refs.formEmail.resetValidation();
                    this.$refs.formEmail.reset();
                    this.updateEmailDialog = false
                }
            } catch (error) {
                this.response = {
                    message:
                        'Aconteceu um erro interno! Verifique sua conexão com a internet. Caso o problema persista, entre em contato conosco.',
                    type: 'error',
                    active: true
                };
            }
        },
        async init() {
            this.loadingDialog = true;
            this.updateEmailDialog = false;
            this.editing = false;
            this.valid = true;
            this.validEmail = true;
            this.response.active = false;
            try {
                this.user = await UserService.getUserData();
            } catch (error) {
                this.response = {
                    message:
                        'Aconteceu um erro interno! Verifique sua conexão com a internet. Caso o problema persista, entre em contato conosco.',
                    type: 'error',
                    active: true
                };
            } finally {
                this.loadingDialog = false;
            }
        },
        async save() {
            if (!this.$refs.form.validate()) {
                this.response.message =
                    'Todos os campos em destaque são obrigatórios';
                this.response.type = 'error';
                this.response.active = true;
                return;
            }
            this.loadingDialog = true;
            try {
                this.response.message = await UserService.registrationUpdate(
                    this.user
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
        async searchCEP() {
            const cep = this.user.cep?.replace(/[^0-9]/g, '');

            if (cep?.length !== 8) return;

            let cepData = await UserService.searchCEP(cep);

            if (cepData.address == undefined) {
                this.response = {
                    message: 'CEP não encontrado',
                    type: 'error',
                    active: true
                };
                this.user.cep = '';
            } else {
                this.user = Object.assign({}, this.user, cepData);
            }
        }
    },
    mounted() {
        this.init();
    }
};
</script>
