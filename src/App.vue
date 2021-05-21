<template>
    <div>
        <v-app id="inspire" transition="slide-x-transition" v-if="loggedUser">
            <drawer-menu></drawer-menu>
            <v-main>
                <v-container>
                    <router-view></router-view>
                </v-container>
            </v-main>
        </v-app>
        <v-app v-else-if="!loggedUser">
            <router-view></router-view>
        </v-app>
    </div>
</template>
<script>
import DrawerMenu from '@/components/DrawerMenu';
export default {
    components: {
        DrawerMenu
    },
    methods: {
        async logout() {
            this.$store.dispatch('logoffUser');
        }
    },
    computed: {
        loggedUser() {
            return this.$store.getters.getStateLog;
        }
    },
    async beforeMount() {
        await this.$store.dispatch('loadLoggedUser');
    },
    created() {
        window.getApp = this;
    }
};
</script>
