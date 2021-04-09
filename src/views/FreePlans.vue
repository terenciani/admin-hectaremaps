<template>
    <v-container>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="contracts"
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
                            <h2>Gestão de Planos Contratados</h2>
                            <v-spacer></v-spacer>
                            <v-divider
                                class="mx-4 d-none d-sm-flex"
                                inset
                                vertical
                            ></v-divider>
                        </v-col>
                        <v-col cols="12" sm="6" md="8">
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
                <v-chip
                    v-if="item.confirm_date"
                    class="ma-2"
                    outlined
                    color="success"
                >
                    {{ utilFormatter.formatDateISOToBR(item.confirm_date) }}
                </v-chip>
                <v-btn
                    v-else
                    outlined
                    :disabled="loading || item.finish_date != undefined"
                    @click="openConfirmDialog(item)"
                    color="primary"
                    title="Autorizar"
                    rounded
                >
                    Autorizar
                </v-btn>
            </template>
            <template v-slot:[`item.finish_date`]="{ item }">
                <v-chip
                    v-if="item.finish_date"
                    class="ma-2"
                    outlined
                    color="error"
                >
                    {{ utilFormatter.formatDateISOToBR(item.finish_date) }}
                </v-chip>
                <v-btn
                    v-else
                    outlined
                    :disabled="loading"
                    @click="openFinishDialog(item)"
                    color="error"
                    title="Finalizar"
                    rounded
                >
                    Encerrar
                </v-btn>
            </template>
            <template slot="footer" v-if="records > 0">
                <v-container>
                    <strong> {{ footerText }} {{ records }} </strong>
                </v-container>
            </template>
            <template slot="no-data" v-else>
                <strong> {{ emptyRecordsText }} </strong>
            </template>
        </v-data-table>
        <confirm-dialog
            :show="dialogConfirm"
            :message="
                `Você está confirmando o plano <span class='font-weight-bold'> ${contract.name}</span>, para o cliente com e-mail <span class='font-weight-bold'>${contract.email}</span>!`
            "
            @confirm="confirm()"
            @cancel="
                dialogConfirm = false;
                contract = {};
            "
        >
        </confirm-dialog>
        <confirm-dialog
            :show="dialogFinish"
            :message="
                `Você está encerrando o plano <span class='font-weight-bold'> ${contract.name}</span>, do cliente com e-mail <span class='font-weight-bold'>${contract.email}</span>!`
            "
            @confirm="finish()"
            @cancel="
                dialogFinish = false;
                contract = {};
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
    </v-container>
</template>

<script>
import ContractService from '../service/ContractService';
import UtilFormatter from '../utils/UtilFormatter';
import ConfirmDialog from '../components/ConfirmDialog.vue';

export default {
    components: { ConfirmDialog },
    name: 'FreeContract',
    data: () => ({
        contracts: [],
        dialogConfirm: false,
        dialogFinish: false,
        utilFormatter: UtilFormatter,
        contract: {},
        response: {
            message: '',
            type: 'success',
            active: false
        },
        footerText: 'Total de registros: ',
        headers: [
            {
                text: 'Email do Cliente',
                align: 'left',
                value: 'email'
            },
            {
                text: 'Plano Contratado',
                align: 'left',
                value: 'name'
            },
            {
                text: 'Data da Contratação',
                align: 'center',
                value: 'contract_date'
            },
            {
                text: 'Expira em',
                align: 'center',
                value: 'expires_in'
            },
            {
                text: 'Autorizado em',
                align: 'center',
                value: 'confirm_date'
            },
            {
                text: 'Data do Encerramento',
                align: 'center',
                value: 'finish_date'
            }
        ],
        loading: false,
        emptyRecordsText: 'Nenhum registro encontrado',
        records: 0,
        search: ''
    }),
    methods: {
        openConfirmDialog(item) {
            this.contract = item;
            this.dialogConfirm = true;
        },
        openFinishDialog(item) {
            this.contract = item;
            this.dialogFinish = true;
        },
        async confirm() {
            try {
                if (!this.contract.id_plan_contract) return;
                this.response.message = await ContractService.confirm(
                    this.contract
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
        async finish() {
            try {
                if (!this.contract.id_plan_contract) return;
                this.response.message = await ContractService.finish(
                    this.contract
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
            this.contracts = await ContractService.getFullContracts();
            this.dialogConfirm = false;
            this.dialogFinish = false;
            this.response.active = false;
            this.calculateRecords();
        }, // init
        calculateRecords() {
            let amount = 0;
            for (let i = 0; i < this.contracts.length; i++) {
                amount++;
            }
            this.records = amount;
        }
    },
    created() {
        this.init();
    }
};
</script>

<style scoped></style>
