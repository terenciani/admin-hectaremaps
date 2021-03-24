<template>
    <div>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="users"
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
                            <h2>Gestão de Usuários</h2>
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
                        <v-col md="3" class="d-none d-md-flex">
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                block
                                large
                            >
                                Novo Usuário
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
            <template v-slot:[`item.role`]="{ item }">
                <v-chip
                    class="ma-2"
                    outlined
                    :color="item.role == 'ADMIN' ? 'primary' : 'default'"
                >
                    {{ item.role == 'ADMIN' ? 'Administrador' : 'Cliente' }}
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
                    @click="edit(item)"
                    color="warning"
                    title="Editar registro"
                    icon
                    large
                >
                    <v-icon color="warning">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                    :disabled="loading"
                    @click="deleteItem(item)"
                    color="error"
                    title="Editar registro"
                    icon
                    large
                >
                    <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import UtilFormatter from '../utils/UtilFormatter';
import UserService from '@/service/UserService';
export default {
    name: 'Users',
    data() {
        return {
            dialog: false,
            dialogRemove: false,
            footerText: 'Total de registros: ',
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'name'
                },
                {
                    text: 'Sobrenome',
                    align: 'left',
                    value: 'lastname'
                },
                {
                    text: 'E-mail',
                    align: 'center',
                    value: 'email'
                },
                {
                    text: 'Criado em',
                    align: 'center',
                    value: 'create_at'
                },
                {
                    text: 'Situação',
                    align: 'center',
                    value: 'status'
                },
                {
                    text: 'Perfil',
                    align: 'center',
                    value: 'role'
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
            search: '',
            user: {},
            userRemove: {},
            users: [],
            utilFormatter: UtilFormatter
        };
    },
    methods: {
        async initialize() {
            this.loading = true;
            try {
                this.users = await UserService.getAll();
                this.user = {};
                this.dialog = false;
                this.calculateRecords();
                this.dialogRemove = false;
                this.userRemove = {};
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        calculateRecords() {
            let amount = 0;
            for (let i = 0; i < this.users.length; i++) {
                amount++;
            }
            this.records = amount;
        },
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
        this.initialize();
    }
};
</script>
