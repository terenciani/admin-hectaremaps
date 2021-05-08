<template>
    <div>
        <v-container>
            <v-data-table
                :loading="loading"
                :headers="headers"
                :items="planContracts"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:top>
                    <v-container>
                        <v-row align="center" class="d-flex justify-space-between">
                            <v-col cols="12" sm="6" class="d-flex align-content-center">
                                <h3>Histórico de Contratos</h3>
                                <v-spacer></v-spacer>
                                <v-divider class="mx-4 d-none d-sm-flex" inset vertical></v-divider>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    class="pt-0"
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Procurar"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
                <template v-slot:[`item.contract_date`]="{ item }">
                    {{ utilFormatter.formatDateISOToBR(item.contract_date) }}
                </template>
                <template v-slot:[`item.expires_in`]="{ item }">
                    {{ utilFormatter.formatDateISOToBR(item.expires_in) }}
                </template>
                <template v-slot:[`item.confirm_date`]="{ item }">
                    {{
                        item.confirm_date
                            ? utilFormatter.formatDateISOToBR(item.confirm_date)
                            : ' Pagamento não confirmado '
                    }}
                </template>
                <template v-slot:[`item.finish_date`]="{ item }">
                    <v-chip class="ma-2" outlined :color="item.finish_date ? 'default' : 'success'">
                        {{
                            item.finish_date
                                ? utilFormatter.formatDateISOToBR(item.finish_date)
                                : ' Ativo '
                        }}
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
                        v-if="!item.confirm_date"
                        :disabled="loading"
                        @click="openConfirmDialog(item)"
                        color="error"
                        title="Cancelar Solicitação"
                        icon
                        large
                    >
                        <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                    <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                :disabled="loading"
                                title="Visualizar Plano"
                                color="info"
                                icon
                                large
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-text>
                                <strong>Plano: </strong> {{ item.name }} {{ item.lastname }} <br />
                                <strong>Valor:</strong>
                                {{ utilFormatter.numberToMoney(item.price) }}
                                <br />
                                <strong>Quantidade de imagens:</strong>
                                {{ utilFormatter.numberDot(item.number_of_images) }}
                                imagens
                                <br />
                                <strong>Espaço de armazenamento:</strong>
                                {{ utilFormatter.spaceTransform(item.storage_space) }}
                                de armazenamento
                                <br />
                                <strong>Validade:</strong>
                                {{ item.months_of_validity }} mês/meses
                            </v-card-text>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-container>
        <confirm-dialog
            :show="dialogRemove"
            :message="
                `<span class='font-weight-bold'>${planContract.name} </span>
                será removido e essa ação não poderá ser desfeita.`
            "
            @confirm="remove()"
            @cancel="
                dialogRemove = false;
                planContract = {};
            "
        >
        </confirm-dialog>

        <confirm-dialog
            :show="dialogRedirect"
            :message="`Depois de finalizar você não poderá fazer alterações na solicitação!`"
            @confirm="$router.push('/mycontracts')"
            @cancel="dialogRedirect = false"
        >
        </confirm-dialog>
        <v-snackbar v-model="message.active" :color="message.type">
            {{ message.text }}
            <template v-slot:action="{ attrs }">
                <v-btn :class="message.type" text v-bind="attrs" @click="message.active = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ContractService from '../service/ContractService';
import UtilFormatter from '../utils/UtilFormatter';
export default {
    components: {
        ConfirmDialog
    },
    name: 'MyRequest',
    data() {
        return {
            dialogRedirect: false,
            dialogRemove: false,
            footerText: 'Total de registros: ',
            search: '',
            utilFormatter: UtilFormatter,
            headers: [
                {
                    text: 'Plano',
                    align: 'center',
                    value: 'name'
                },
                {
                    text: 'Contratado em',
                    align: 'center',
                    value: 'contract_date'
                },
                {
                    text: 'Confirmado em',
                    align: 'center',
                    value: 'confirm_date'
                },
                {
                    text: 'Expira em',
                    align: 'center',
                    value: 'expires_in'
                },
                {
                    text: 'Encerrado em',
                    align: 'center',
                    value: 'finish_date'
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
            planContract: {},
            planContracts: [],
            message: {
                text: '',
                type: '',
                active: false
            }
        };
    },
    methods: {
        openConfirmDialog(item) {
            this.planContract = item;
            this.dialogRemove = true;
        },
        async remove() {
            if (!this.planContract) return;

            this.loading = true;
            try {
                this.message.text = await ContractService.cancelContract(this.planContract);
                this.message.type = 'success';
            } catch (error) {
                this.message = {
                    text: 'Aconteceu um erro interno! Aguarde um momento e tente novamente',
                    type: 'error'
                };
            } finally {
                this.init();
                this.message.active = true;
            }
        },
        async init() {
            this.loading = true;
            this.list = true;
            (this.dialogRemove = false),
                (this.planContracts = await ContractService.getAllUserContracts());
            this.loading = false;
        }
    },
    mounted() {
        this.init();
    }
};
</script>
