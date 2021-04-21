<template>
    <div>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="services"
            :search="search"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-container>
                    <v-row align="center" class="d-flex justify-space-between">
                        <v-col
                            cols="12"
                            sm="6"
                            md="3"
                            class="d-flex align-content-center"
                        >
                            <h3>Gestão de Serviços</h3>
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
                                @click="openCreateDialog"
                            >
                                Novo Serviço
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
                            @click="openCreateDialog"
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
            <template v-slot:[`item.price`]="{ item }">
                {{ utilFormatter.numberToMoney(item.price) }}
            </template>
            <template v-slot:[`item.active`]="{ item }">
                <v-chip
                    class="ma-2"
                    outlined
                    :color="item.active == 1 ? 'primary' : 'default'"
                >
                    {{ item.active == 1 ? 'Ativo' : 'Inativo' }}
                </v-chip>
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
                    :disabled="loading"
                    @click="openEditDialog(item)"
                    color="warning"
                    title="Editar registro"
                    icon
                    large
                >
                    <v-icon color="warning">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                    :disabled="loading"
                    @click="openConfirmDialog(item)"
                    color="error"
                    title="Editar registro"
                    icon
                    large
                >
                    <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogForm" fullscreen>
            <v-card>
                <v-toolbar color="teal" dark>
                    {{ service.id_service == null ? 'Novo' : 'Editando' }}
                    Serviço
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="init">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pb-0">
                    <v-container class="pt-5">
                        <v-form ref="form" v-model="valid">
                            <v-row>
                                <v-col cols="12" md="5" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Nome *"
                                        v-model="service.name"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="5" class="py-xs-2 py-sm-0">
                                    <v-currency-field
                                        label="Valor Unitário (R$)"
                                        v-bind="currency_config"
                                        v-model="service.price"
                                        :rules="[requiredRule]"
                                    >
                                    </v-currency-field>
                                </v-col>
                                <v-col cols="12" md="2" class="py-xs-2 py-sm-0">
                                    <v-checkbox
                                        v-model="service.active"
                                        label="Ativo?"
                                        :value="service.active"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="12" class="py-xs-2 py-sm-0">
                                    <v-textarea
                                        label="Descrição"
                                        :rules="[requiredRule]"
                                        v-model="service.description"
                                    ></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="3"
                                            v-if="service.image"
                                        >
                                            <v-img
                                                :src="
                                                    `${host}/assets/${service.image}`
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
                                                <v-col
                                                    cols="12"
                                                    v-if="
                                                        !alterImage &&
                                                            service.image
                                                    "
                                                >
                                                    <v-btn
                                                        class="teal white--text"
                                                        large
                                                        block
                                                        @click="
                                                            alterImage = true
                                                        "
                                                    >
                                                        {{
                                                            service.id_service
                                                                ? 'Alterar Imagem'
                                                                : 'Adicionar Imagem'
                                                        }}
                                                    </v-btn>
                                                </v-col>
                                                <v-col cols="12" v-else>
                                                    <v-row>
                                                        <v-col
                                                            cols="12"
                                                            md="9"
                                                            class="pb-0"
                                                        >
                                                            <v-file-input
                                                                label="Imagem do serviço"
                                                                outlined
                                                                :rules="[
                                                                    requiredRule
                                                                ]"
                                                                accept="image/*"
                                                                prepend-icon="mdi-camera"
                                                                @change="
                                                                    selectFile
                                                                "
                                                            ></v-file-input>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                                <v-col
                                                    cols="12"
                                                    v-if="currentFile"
                                                >
                                                    <v-progress-linear
                                                        v-model="progress"
                                                        color="light-blue"
                                                        height="25"
                                                        reactive
                                                    >
                                                        <strong
                                                            >{{
                                                                progress
                                                            }}
                                                            %</strong
                                                        >
                                                    </v-progress-linear>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions bottom>
                    <v-container class="py-5 text-right">
                        <v-btn @click="init" color="error" class="mr-sm-5">
                            Cancelar
                        </v-btn>
                        <v-btn color="success lighten-1" @click="save">
                            Salvar
                        </v-btn>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <confirm-dialog
            :show="dialogRemove"
            :message="
                `<span class='font-weight-bold'>${service.name}</span> será removido e essa ação não poderá ser desfeita.`
            "
            @confirm="remove()"
            @cancel="
                dialogRemove = false;
                service = {};
            "
        >
        </confirm-dialog>
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
import Currency from '../utils/Currency';
import UtilFormatter from '../utils/UtilFormatter';
import ServiceService from '@/service/ServiceService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import config from './../../config';
export default {
    components: { ConfirmDialog },
    name: 'Plans',
    data() {
        return {
            progress: 0,
            host: config.apiHost,
            currentFile: undefined,
            alterImage: false,
            dialogForm: false,
            dialogRemove: false,
            footerText: 'Total de registros: ',
            currency_config: Currency.real,
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'name'
                },
                {
                    text: 'Preço',
                    align: 'right',
                    value: 'price'
                },
                {
                    text: 'Criado em',
                    align: 'center',
                    value: 'create_at'
                },
                {
                    text: 'Situação',
                    align: 'center',
                    value: 'active'
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
            response: {
                message: '',
                type: 'success',
                active: false
            },
            search: '',
            service: {},
            services: [],
            ServiceServices: [],
            utilFormatter: UtilFormatter,
            valid: true,
            requiredRule: v => !!v || 'Este campo é obrigatório.'
        };
    },
    methods: {
        selectFile(file) {
            this.progress = 0;
            this.currentFile = file;
        },
        openCreateDialog() {
            this.service = Object.assign({}, undefined);
            this.dialogForm = true;
        },
        async openEditDialog(item) {
            this.service = Object.assign({}, item);
            this.service.price = await item.price;
            this.dialogForm = true;
        },
        openConfirmDialog(item) {
            this.service = item;
            this.dialogRemove = true;
        },
        async remove() {
            this.loading = true;
            try {
                this.response.message = await ServiceService.remove(
                    this.service
                );
                this.response.type = 'success';
            } catch (error) {
                this.response.message = error;
                this.response.type = 'error';
            } finally {
                this.init();
                this.response.active = true;
            }
        },
        async init() {
            this.loading = true;
            try {
                this.dialogRemove = false;
                this.response.active = false;
                this.service = {};
                this.dialogForm = false;
                this.services = await ServiceService.getAll();
                this.calculateRecords();
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        calculateRecords() {
            let amount = 0;
            for (let i = 0; i < this.services.length; i++) {
                amount++;
            }
            this.records = amount;
        },
        async save() {
            if (!this.$refs.form.validate()) return;
            try {
                if (this.service.id_service) {
                    ServiceService.update(
                        this.currentFile,
                        this.service,
                        event => {
                            this.progress = Math.round(
                                (100 * event.loaded) / event.total
                            );
                        }
                    )
                        .then(() => {
                            this.response = {
                                message: 'Serviço cadastrado com sucesso!',
                                type: 'success',
                                active: true
                            };
                            this.init();
                        })
                        .catch(() => {
                            this.progress = 0;
                            this.response = {
                                message:
                                    'Não foi possível cadastrar este serviço. Tente mais tarde!',
                                type: 'error',
                                active: true
                            };
                        });
                } else {
                    ServiceService.save(
                        this.currentFile,
                        this.service,
                        event => {
                            this.progress = Math.round(
                                (100 * event.loaded) / event.total
                            );
                        }
                    )
                        .then(() => {
                            this.response = {
                                message: 'Serviço cadastrado com sucesso!',
                                type: 'success',
                                active: true
                            };
                            this.init();
                        })
                        .catch(() => {
                            this.progress = 0;
                            this.response = {
                                message:
                                    'Não foi possível cadastrar este serviço. Tente mais tarde!',
                                type: 'error',
                                active: true
                            };
                        });
                }
            } catch (error) {
                this.response.message = error;
                this.response.type = 'error';
            } finally {
                this.init();
                this.response.active = true;
            }
        }, // save()
        getColor(status) {
            switch (status) {
                case 'ACTIVE':
                    return 'primary';
                default:
                    return 'default';
            }
        },
        getText(status) {
            switch (status) {
                case 'ACTIVE':
                    return 'Ativo';
                default:
                    return 'Inativo';
            }
        }
    },
    created() {
        this.init();
    },
    watch: {
        dialogForm() {
            if (!this.service.id_service) this.$refs.form?.reset();
            this.$refs.form?.resetValidation();
        }
    }
};
</script>
