<template>
    <v-row class="mt-5">
        <user-analytics v-if="role == 'ADMIN'"></user-analytics>
        <plan-analytics v-if="role == 'ADMIN'"></plan-analytics>
        <request-analytics v-if="role == 'ADMIN'"></request-analytics>
        <user-requests-analytics></user-requests-analytics>
    </v-row>
</template>

<script>
import UserAnalytics from '../components/home/UserAnalytics';
import PlanAnalytics from '../components/home/PlanAnalytics';
import RequestAnalytics from '../components/home/RequestAnalytics';
import UserRequestsAnalytics from '../components/home/UserRequestsAnalytics';
import AuthService from '../service/AuthService';
export default {
    name: 'Home',
    data() {
        return {
            role: 'USER'
        };
    },
    components: {
        UserAnalytics,
        PlanAnalytics,
        RequestAnalytics,
        UserRequestsAnalytics
    },
    async mounted() {
        this.role = await AuthService.getRoleUser();
    }
};
</script>
