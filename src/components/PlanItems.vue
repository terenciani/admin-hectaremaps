<template>
    <div>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="planItems"
            :search="search"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-container>
                    <v-row align="center" class="d-flex justify-space-between">
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="d-flex align-content-center"
                        >
                            <h2>Serviços Inclusos</h2>
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
                        <v-col md="3">
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
        <v-dialog
            v-model="dialogForm"
            :fullscreen="$vuetify.breakpoint.xs"
            max-width="600px"
        >
            <v-card>
                <v-toolbar color="teal" dark>
                    {{ planItem.id_plan == null ? 'Novo' : 'Editando' }} Serviço
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="init">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pb-0">
                    <v-container class="pt-5">
                        <v-form ref="form" v-model="valid">
                            <v-row>
                                <v-col cols="12" sm="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Descrição *"
                                        v-model="planItem.description"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Quantidade *"
                                        v-model="planItem.quantity"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" class="py-xs-2 py-sm-0">
                                    <v-currency-field
                                        label="Valor Unitário (R$)"
                                        v-bind="currency_config"
                                        v-model="planItem.price"
                                        :rules="[requiredRule]"
                                    >
                                    </v-currency-field>
                                </v-col>
                                <v-col cols="12" sm="6" class="py-xs-2 py-sm-0">
                                    <v-text-field
                                        label="Unidade de medida (m, ha..) *"
                                        v-model="planItem.unit"
                                        :rules="[requiredRule]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" class="py-xs-2 py-sm-0">
                                    <v-checkbox
                                        v-model="planItem.active"
                                        label="Ativo?"
                                        :value="planItem.active"
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions bottom>
                    <v-container class="py-0 text-right">
                        <v-btn @click="init" color="error" text>
                            Cancelar
                        </v-btn>
                        <v-btn color="success lighten-1" text @click="save">
                            Salvar
                        </v-btn>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <confirm-dialog
            :show="dialogRemove"
            :message="
                `<span class='font-weight-bold'>${planItem.description}</span> será removido e essa ação não poderá ser desfeita.`
            "
            @confirm="remove()"
            @cancel="
                dialogRemove = false;
                planItem = {
                    fk_plan: plan
                };
            "
        >
        </confirm-dialog>
        <default-snackbar
            :show="response.active"
            :type="response.type"
            :message="response.message"
            @close="response.active = false"
        />
    </div>
</template>
<script>
import Currency from '../utils/Currency';
import UtilFormatter from '../utils/UtilFormatter';
import PlanService from '@/service/PlanService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import DefaultSnackbar from '@/components/DefaultSnackbar';

export default {
    components: { ConfirmDialog, DefaultSnackbar },
    data() {
        return {
            dialogForm: false,
            dialogRemove: false,
            footerText: 'Total de registros: ',
            currency_config: Currency.real,
            headers: [
                {
                    text: 'Descrição',
                    align: 'left',
                    value: 'description'
                },
                {
                    text: 'Quantidade',
                    align: 'center',
                    value: 'quantity'
                },
                {
                    text: 'Unidade de Medida',
                    align: 'center',
                    value: 'unit'
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
            planItem: {
                fk_plan: this.plan
            },
            planItems: [],
            valid: true,
            requiredRule: v => !!v || 'Este campo é obrigatório.',
            utilFormatter: UtilFormatter
        };
    },
    props: {
        plan: Number
    },
    methods: {
        openCreateDialog() {
            this.planItem = Object.assign({}, { fk_plan: this.plan });
            this.dialogForm = true;
        },
        async openEditDialog(item) {
            this.planItem = Object.assign({}, item);
            this.planItem.price = await item.price;
            this.dialogForm = true;
        },
        openConfirmDialog(item) {
            this.planItem = item;
            this.dialogRemove = true;
        },
        async remove() {
            this.loading = true;
            try {
                this.response.message = await PlanService.removePlanItem(
                    this.planItem
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
                this.planItem = {
                    fk_plan: this.plan
                };
                this.dialogForm = false;
                this.planItems = await PlanService.getItemsByPlan(this.plan);
                this.calculateRecords();
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        calculateRecords() {
            let amount = 0;
            for (let i = 0; i < this.planItems.length; i++) {
                amount++;
            }
            this.records = amount;
        },
        async save() {
            if (!this.$refs.form.validate()) return;
            try {
                if (this.planItem.id_item_plan) {
                    this.response.message = await PlanService.updatePlanItem(
                        this.planItem
                    );
                    this.response.type = 'success';
                } else {
                    this.response.message = await PlanService.savePlanItem(
                        this.planItem
                    );
                    this.response.type = 'success';
                }
            } catch (error) {
                this.response.message = error;
                this.response.type = 'error';
            } finally {
                this.init();
                this.response.active = true;
            }
        } // save()
    },
    created() {
        this.init();
    },
    watch: {
        plan() {
            this.init();
        },
        dialogForm() {
            if (!this.planItem.id_item_plan) this.$refs.form?.reset();
            this.$refs.form?.resetValidation();
        }
    }
};
</script>
