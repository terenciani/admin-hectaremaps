<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-alert type="warning" dismissible dense outlined>
                    <span class="font-weight-bold">ATENÇÃO!</span> Após a
                    contratação do plano você deverá entrar em contato pelo
                    nosso telefone para efetivar a compra. Assim que
                    confirmarmos o recebimento, seu acesso será liberado.
                </v-alert>
            </v-col>
        </v-row>
        <v-row v-if="!planContracted.id_plan_contract">
            <v-col
                cols="12"
                sm="4"
                v-for="plan in plansAndItems"
                :key="plan.id_plan"
            >
                <v-hover>
                    <template v-slot:default="{ hover }">
                        <v-card
                            class="mx-auto"
                            :elevation="plan.site_emphasis ? 24 : 1"
                        >
                            <v-card-title
                                :class="
                                    `teal ${
                                        plan.site_emphasis
                                            ? 'darken-4'
                                            : 'lighten-1'
                                    } white--text d-block text-center`
                                "
                                >{{ plan.name }} <br />
                                <div class="text-subtitle-1">
                                    {{
                                        utilFormatter.numberToMoney(plan.price)
                                    }}
                                </div>
                            </v-card-title>
                            <v-divider class="mx-4"></v-divider>
                            <v-card-text>
                                <div class="text--primary">
                                    {{ numberDot(plan.number_of_images) }}
                                    Imagens
                                </div>
                                <v-divider class="my-4"></v-divider>
                                <div class="text--primary">
                                    {{ spaceTransform(plan.storage_space) }} de
                                    armazenamento
                                </div>
                                <v-divider class="my-4"></v-divider>
                                <template v-for="planItems in plan.plan_items">
                                    <div
                                        :key="planItems.id_item_plan"
                                        class="text--primary"
                                    >
                                        {{ planItems.description }}
                                    </div>
                                    <v-divider
                                        class="my-4"
                                        :key="planItems.id_item_plan * 4"
                                    ></v-divider>
                                </template>

                                <div
                                    class="text-subtitle-2"
                                    v-if="plan.observation"
                                >
                                    * {{ plan.observation }}
                                </div>
                            </v-card-text>
                            <v-fade-transition>
                                <v-overlay
                                    v-if="hover"
                                    absolute
                                    color="#036358"
                                >
                                    <v-btn
                                        large
                                        color="primary accent-4"
                                        @click="openConfirmDialog(plan)"
                                    >
                                        Contratar
                                    </v-btn>
                                </v-overlay>
                            </v-fade-transition>
                        </v-card>
                    </template>
                </v-hover>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-alert dismissible dense outlined type="info">
                    <v-row align="center">
                        <v-col class="grow">
                            Você já possui um plano contratado
                        </v-col>
                        <v-col class="shrink">
                            <v-btn to="/myplans" text
                                >Ir para meus planos</v-btn
                            >
                        </v-col>
                    </v-row>
                </v-alert>
            </v-col>
        </v-row>
        <confirm-dialog
            :show="dialogConfirm"
            :message="
                `Você está contrando o plano <span class='font-weight-bold'> ${
                    plan.name
                }</span>, com vigência de <span class='font-weight-bold'>${
                    plan.months_of_validity
                } ${plan.months_of_validity == 1 ? ' mês ' : 'meses'}</span>
                a partir da confirmação do pagamento.`
            "
            @confirm="contract()"
            @cancel="
                dialogConfirm = false;
                plan = {};
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
import PlanService from '../service/PlanService';
import ContractService from '../service/ContractService';
import UtilFormatter from '../utils/UtilFormatter';
import ConfirmDialog from '../components/ConfirmDialog.vue';

export default {
    components: { ConfirmDialog },
    name: 'PlanContract',
    data: () => ({
        plansAndItems: [],
        dialogConfirm: false,
        utilFormatter: UtilFormatter,
        plan: {},
        planContracted: {},
        response: {
            message: '',
            type: 'success',
            active: false
        }
    }),
    methods: {
        openConfirmDialog(item) {
            this.plan = item;
            this.dialogConfirm = true;
        },
        async contract() {
            try {
                if (!this.plan.id_plan) return;
                this.response.message = await ContractService.contract(
                    this.plan
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
            this.planContracted = await ContractService.getContractCurrentByUser();
            this.plansAndItems = await PlanService.getAllPlansAndItems();
            this.dialogConfirm = false;
            this.response.active = false;
        }, // init
        numberDot(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }, // numberDot
        spaceTransform(space) {
            if (space < 1024) return space + ' Mb';
            return (
                (space / 1024)
                    .toFixed(2)
                    .toString()
                    .replace('.', ',') + ' Gb'
            );
        } // spaceTransform
    },
    created() {
        this.init();
    }
};
</script>

<style scoped></style>
