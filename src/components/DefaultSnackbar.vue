<template>
    <v-snackbar v-model="visible" :color="type">
        {{ message }}
        <template v-slot:action="{ attrs }">
            <v-btn :class="type" text v-bind="attrs" @click="$emit('close')">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>
</template>
<script>
export default {
    props: {
        show: Boolean,
        type: String,
        message: String
    },
    computed: {
        visible() {
            return this.show ? this.show : false;
        }
    }
};
</script>
