<template>
    <div>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="plans"
            :search="search"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-container>
                    <v-row align="center" class="d-flex justify-space-between">
                        <v-col cols="12" sm="6" md="3" class="d-flex align-content-center">
                            <h3>Gestão de Planos</h3>
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
                                @click="openCreateDialog"
                            >
                                Novo Plano
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
            <template v-slot:[`item.storage_space`]="{ item }">
                {{ utilFormatter.spaceTransform(item.storage_space) }}
            </template>

            <template v-slot:[`item.number_of_images`]="{ item }">
                {{ utilFormatter.numberDot(item.number_of_images) }}
            </template>

            <template v-slot:[`item.active`]="{ item }">
                <v-chip class="ma-2" outlined :color="item.active == 1 ? 'primary' : 'default'">
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
                    {{ plan.id_plan == null ? 'Novo' : 'Editando' }} Plano
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="init">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pb-0">
                    <v-container class="pt-5">
                        <v-form ref="form" v-model="valid">
                            <v-row>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Nome *"
                                        v-model="plan.name"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <v-currency-field
                                        label="Valor Unitário (R$)"
                                        v-bind="currency_config"
                                        v-model="plan.price"
                                        :rules="[requiredRule]"
                                    >
                                    </v-currency-field>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Quantidade de Imagens *"
                                        v-model="plan.number_of_images"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Espaço de Armazenamento (em Mb) *"
                                        v-model="plan.storage_space"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <strong>Situação</strong>
                                    <v-checkbox
                                        v-model="plan.active"
                                        label="Ativo?"
                                        :value="plan.active"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <strong>Site</strong>
                                    <v-checkbox
                                        v-model="plan.site_emphasis"
                                        label="Dar destaque neste plano?"
                                        :value="plan.site_emphasis"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Quantidade de meses de vigência do plano para o cliente  *"
                                        v-model="plan.months_of_validity"
                                        type="number"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="py-xs-2 py-sm-0">
                                    <v-textarea
                                        label="Observação"
                                        v-model="plan.observation"
                                    ></v-textarea>
                                </v-col>
                                <v-col cols="12" class="py-xs-2 py-sm-0">
                                    <plan-items
                                        v-if="plan.id_plan"
                                        :plan="plan.id_plan"
                                    ></plan-items>
                                    <v-alert type="info" v-else dismissible dense outlined>
                                        Você poderá adicionar os serviços deste plano na opção
                                        editar (<v-icon color="warning">mdi-pencil</v-icon>) após
                                        salvá-lo!
                                    </v-alert>
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
                `<span class='font-weight-bold'>${plan.name}</span> será removido e essa ação não poderá ser desfeita.`
            "
            @confirm="remove()"
            @cancel="
                dialogRemove = false;
                plan = {};
            "
        >
        </confirm-dialog>
        <v-snackbar v-model="response.active" :color="response.type">
            {{ response.message }}
            <template v-slot:action="{ attrs }">
                <v-btn :class="response.type" text v-bind="attrs" @click="response.active = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import Currency from '../utils/Currency';
import UtilFormatter from '../utils/UtilFormatter';
import PlanService from '@/service/PlanService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import PlanItems from '@/components/PlanItems';
export default {
    components: { ConfirmDialog, PlanItems },
    name: 'Plans',
    data() {
        return {
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
                    text: 'Quantidade de imagens',
                    align: 'center',
                    value: 'number_of_images'
                },
                {
                    text: 'Espaço de Armazenamento',
                    align: 'center',
                    value: 'storage_space'
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
            plan: {},
            plans: [],
            planServices: [],
            utilFormatter: UtilFormatter,
            valid: true,
            requiredRule: v => !!v || 'Este campo é obrigatório.'
        };
    },
    methods: {
        openCreateDialog() {
            this.plan = Object.assign({}, undefined);
            this.dialogForm = true;
        },
        async openEditDialog(item) {
            this.plan = Object.assign({}, item);
            this.plan.price = await item.price;
            this.dialogForm = true;
        },
        openConfirmDialog(item) {
            this.plan = item;
            this.dialogRemove = true;
        },
        async remove() {
            this.loading = true;
            try {
                this.response.message = await PlanService.remove(this.plan);
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
                this.plan = {};
                this.dialogForm = false;
                this.plans = await PlanService.getAll();
                this.calculateRecords();
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        calculateRecords() {
            let amount = 0;
            for (let i = 0; i < this.plans.length; i++) {
                amount++;
            }
            this.records = amount;
        },
        async save() {
            if (!this.$refs.form.validate()) return;
            try {
                if (this.plan.id_plan) {
                    this.response.message = await PlanService.update(this.plan);
                    this.response.type = 'success';
                } else {
                    this.response.message = await PlanService.save(this.plan);
                    this.response.type = 'success';
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
                case 'BLOCKED':
                    return 'red';
                case 'NEW':
                    return 'green';
                case 'UPDATE':
                    return 'orange';
                default:
                    return 'default';
            }
        },
        getText(status) {
            switch (status) {
                case 'ACTIVE':
                    return 'Ativo';
                case 'BLOCKED':
                    return 'Bloqueado';
                case 'NEW':
                    return 'Novo';
                case 'UPDATE':
                    return 'Atualizar';
                default:
                    return 'default';
            }
        }
    },
    created() {
        this.init();
    },
    watch: {
        dialogForm() {
            if (!this.plan.id_plan) this.$refs.form?.reset();
            this.$refs.form?.resetValidation();
        }
    }
};
</script>
