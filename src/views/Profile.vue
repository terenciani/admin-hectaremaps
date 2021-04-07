<template>
    <div>
        <v-row>
            <v-col cols="12" md="6">
                <v-checkbox
                    v-model="editing"
                    :disabled="loadingDialog || editing"
                    label="Ativar Edição"
                ></v-checkbox>
            </v-col>
            <v-col
                cols="12"
                md="6"
                class="text-center text-md-right"
                v-if="editing"
            >
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
import UserService from '../service/UserService';
import DefaultSnackbar from '@/components/DefaultSnackbar';
import LoadingDialog from '@/components/LoadingDialog';
export default {
    name: 'Profile',
    components: {
        DefaultSnackbar,
        LoadingDialog
    },
    data() {
        return {
            user: {
                address: '',
                complement: '',
                district: '',
                city: '',
                uf: ''
            },
            editing: false,
            valid: true,
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
            cepData: {}
        };
    },
    methods: {
        async init() {
            this.editing = false;
            this.user = await UserService.getUserData();
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
