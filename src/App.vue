<template>
    <div>
        <v-app
            id="inspire"
            transition="slide-x-transition"
            v-if="loggedUser && loggedLocal"
        >
            <drawer-menu></drawer-menu>

            <v-main v-if="isUnauthorized">
                <v-layout fill-height justify-center align-center>
                    <v-container>
                        <v-col cols="12" class="text-center">
                            <v-icon size="60px">{{
                                unauthorizedSection.icon
                            }}</v-icon>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <span class="display-1">{{
                                unauthorizedSection.text
                            }}</span>
                        </v-col>
                    </v-container>
                </v-layout>
            </v-main>
            <v-main v-else-if="isExpired">
                <v-layout fill-height justify-center align-center>
                    <v-container>
                        <v-col cols="12" class="text-center">
                            <v-icon size="60px">{{
                                expiredSection.icon
                            }}</v-icon>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <span class="display-1">{{
                                expiredSection.text
                            }}</span>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn color="info" outlined large @click="logout"
                                >Fazer Login</v-btn
                            >
                        </v-col>
                    </v-container>
                </v-layout>
            </v-main>
            <v-main v-else>
                <v-container>
                    <router-view></router-view>
                </v-container>
            </v-main>
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
import DrawerMenu from '@/components/DrawerMenu';
export default {
    components: {
        FormLogin,
        DrawerMenu
    },
    data() {
        return {
            loggedLocal: false,
            unauthorizedSection: {
                icon: 'mdi-link-lock',
                text: 'Acesso não autorizado'
            },
            expiredSection: {
                icon: 'mdi-clock',
                text: 'Sessão Expirada'
            }
        };
    },
    methods: {
        init() {
            this.loggedLocal = false;
        },
        async logout() {
            await AuthService.removeUserFromLocalStorage;
            this.$store.dispatch('logoffUser');
        }
    },
    computed: {
        loggedUser() {
            return this.$store.getters.getStateLog;
        },
        isUnauthorized() {
            return this.$route.path == '/unauthorized' ? true : false;
        },
        isExpired() {
            return this.$route.path == '/expired' ? true : false;
        }
    },
    beforeMount() {
        this.user = AuthService.getLoggedUser();
        if (this.user?.id_user) {
            this.loggedLocal = true;
        }
    },
    async mounted() {
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
