<template>
    <div>
        <v-app
            id="inspire"
            transition="slide-x-transition"
            v-if="loggedUser && loggedLocal"
        >
            <v-app-bar color="teal accent-4" dark app>
                <v-app-bar-nav-icon
                    @click.stop="drawer = !drawer"
                ></v-app-bar-nav-icon>

                <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-list dense color="transparent">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">
                                {{ user.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ user.email }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-btn @click="logout" icon title="Sair">
                    <v-icon dark>
                        mdi-logout
                    </v-icon>
                </v-btn>
            </v-app-bar>
            <v-navigation-drawer
                src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
                v-model="drawer"
                temporary
                clipped
                dark
                top
            >
                <v-list class="text-xs-center" dense>
                    <v-img
                        :src="require('@/assets/logo.png')"
                        style="width:50%; margin: 0 auto;"
                        alt="Logo"
                    />
                    <v-divider />
                    <v-list-item-group
                        v-model="group"
                        v-if="items.length > 0"
                        active-class="deep-purple--text text--accent-4"
                    >
                        <template v-for="item in items">
                            <v-list-item :key="item.text" :to="item.to" @click="toolbarTitle = item.text">
                                <v-list-item-icon>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>{{
                                    item.text
                                }}</v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-list-item-group>
                </v-list>
                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block @click="logout" outlined>
                            <v-icon left dark>
                                mdi-logout
                            </v-icon>
                            Sair
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>
        </v-app>
        <v-app v-else>
            <v-main class="bg-image">
                <v-container fluid fill-height>
                    <form-login></form-login>
                </v-container>
            </v-main>
        </v-app>
    </div>
</template>
<script>
import FormLogin from '@/components/FormLogin';
import AuthService from '@/service/AuthService';
import DrawerItems from '@/data/DrawerItems';
export default {
    components: {
        FormLogin
    },
    data() {
        return {
            loggedLocal: false,
            drawer: true,
            toolbarTitle: 'Início',
            group: null,
            user: {},
            items: []
        };
    },
    methods: {
        init() {
            this.loggedLocal = false;
        },
        logout() {
            AuthService.removeUserFromLocalStorage();
            this.$router.push('/');
            this.$store.commit('loggoutUser');
        }
    },
    computed: {
        loggedUser() {
            return this.$store.getters.getStateLog;
        },
        isUnauthorized() {
            return this.$route.path == '/unauthorized' ? true : false;
        }
    },
    beforeMount() {
        this.user = AuthService.getLoggedUser()
        if (this.user.id_user) {
            this.loggedLocal = true;
        }
    },
    async mounted() {
        this.items = await DrawerItems.getItems();
        this.$store.dispatch('loadLoggedUser');
    },

    created() {
        window.getApp = this;
    }
};
</script>
<style scoped>
.bg-image {
    background-image: url('assets/bg_main.jpg');
    background-position: center;
    background-size: cover;
}
</style>
