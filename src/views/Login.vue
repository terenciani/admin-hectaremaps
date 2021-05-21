<template>
    <div class="bg-image">
        <v-container fluid fill-height>
            <form-login></form-login>
        </v-container>
    </div>
</template>

<script>
import FormLogin from '@/components/FormLogin';
export default {
    components: {
        FormLogin
    }
};
</script>
