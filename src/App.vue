<template>
    <div>
        <v-app v-if="loggedUser"> </v-app>
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

export default {
    components: {
        FormLogin
    },
    data() {
        return {
            loggedUser: false
        };
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
