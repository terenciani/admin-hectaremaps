<template>
    <div>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="users"
            class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.lastname }}</td>
                <td class="text-xs-center">{{ props.item.email }}</td>
                <td class="text-xs-center">
                    {{ utilFormatter.formatDateISOToBR(props.item.create_at) }}
                </td>
                <td class="text-xs-center">
                    <v-chip small class="white--text font-weight-light">
                        {{ props.item.status }}</v-chip
                    >
                </td>
                <td class="text-xs-center">{{ props.item.role }}</td>
                <td class="justify-center layout px-0">
                    <v-btn
                        :disabled="loading"
                        @click="edit(props.item)"
                        color="info"
                        title="Editar registro"
                        icon
                        round
                        flat
                    >
                        <v-icon color="info">edit</v-icon>
                    </v-btn>
                </td>
            </template>
            <template slot="footer" v-if="records > 0">
                <td colspan="100%">
                    <strong> {{ footerText }} {{ records }} </strong>
                </td>
            </template>
            <template slot="no-data" v-else>
                <strong> {{ emptyRecordsText }} </strong>
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
                }
            ],
            loading: false,
            emptyRecordsText: 'Nenhum registro encontrado',
            records: 0,
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
        }
    },
    created() {
        this.initialize();
    }
};
</script>
