<template>
    <div>
        <v-navigation-drawer
            app
            v-model="drawer"
            clipped
            disable-resize-watcher
        >
            <v-list>
                <template v-for="(item, index) in items">
                    <v-list-item link :key="index" :to="item.to">
                        <v-list-item-title class="text-capitalize">
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item>
                    <v-divider :key="`divider-${index}`"></v-divider>
                </template>
                <v-list-item link to="/admin">
                    <v-list-item-title class="text-capitalize">
                        Entrar
                    </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item link @click.stop="dialog = true">
                    <v-list-item-title class="text-capitalize">
                        Solicitar Cadastro
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>
<script>
import AuthService from '../service/AuthService';
export default {
    data() {
        return {
            drawer: false,
            group: null,
            items: [
                {
                    icon: 'home',
                    text: 'Dashboard',
                    to: '/'
                }
            ]
        };
    },
    methods: {
        logout() {
            AuthService.removeUserFromLocalStorage();
            this.$router.push('/');
            this.$store.commit('loggoutUser');
            this.$emit('loggout');
        }
    }
};
</script>
