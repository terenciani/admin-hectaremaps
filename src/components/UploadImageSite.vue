<template>
    <v-row id="upload-image-site">
        <v-col cols="12" sm="6" md="3">
            <v-img
                :src="`${host}/assets/${backgroundImage}`"
                max-width="500"
                max-height="300"
            >
                <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                    >
                        <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                        ></v-progress-circular>
                    </v-row>
                </template>
            </v-img>
        </v-col>
        <v-col cols="12" sm="6" md="9" class="d-flex align-center">
            <v-row>
                <v-col cols="12" v-if="!alterImage">
                    <v-btn
                        class="teal white--text"
                        large
                        block
                        :disabled="loadingDialog || !editing"
                        @click="alterImage = true"
                    >
                        Alterar Imagem
                    </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                    <v-row>
                        <v-col cols="12" md="9" class="pb-0">
                            <v-file-input
                                label="Imagem de fundo"
                                outlined
                                accept="image/*"
                                prepend-icon="mdi-camera"
                                :disabled="loadingDialog || !editing"
                                @change="selectFile"
                            ></v-file-input>
                        </v-col>
                        <v-col cols="12" md="2" class="pb-0">
                            <v-btn
                                color="success"
                                large
                                block
                                :disabled="
                                    loadingDialog || !editing || !currentFile
                                "
                                @click="upload()"
                            >
                                Atualizar
                                <v-icon right dark>mdi-cloud-upload</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" v-if="currentFile">
                    <v-progress-linear
                        v-model="progress"
                        color="light-blue"
                        height="25"
                        reactive
                    >
                        <strong>{{ progress }} %</strong>
                    </v-progress-linear>
                </v-col>
            </v-row>
        </v-col>

        <default-snackbar
            :show="response.active"
            :type="response.type"
            :message="response.message"
            @close="response.active = false"
        ></default-snackbar>
    </v-row>
</template>
<script>
import config from './../../config';
import UploadService from '@/service/UploadService';
import DefaultSnackbar from './DefaultSnackbar';
export default {
    components: {
        DefaultSnackbar
    },
    data() {
        return {
            progress: 0,
            host: config.apiHost,
            currentFile: undefined,
            response: {
                message: '',
                type: 'success',
                active: false
            },
            alterImage: false
        };
    },
    methods: {
        selectFile(file) {
            this.progress = 0;
            this.currentFile = file;
        },
        upload() {
            if (!this.currentFile) {
                this.response = {
                    message: 'Por favor, selecione uma imagem!',
                    type: 'error',
                    active: true
                };
                return;
            }
            UploadService.upload(this.currentFile, this.area, event => {
                this.progress = Math.round((100 * event.loaded) / event.total);
            })
                .then(() => {
                    this.response = {
                        message: 'Imagem enviada com sucesso!',
                        type: 'success',
                        active: true
                    };
                    this.init();
                })
                .catch(() => {
                    this.progress = 0;
                    this.response = {
                        message:
                            'Não foi possível enviar a imagem. Tente mais tarde!',
                        type: 'error',
                        active: true
                    };
                    this.init();
                });
        },
        init() {
            this.alterImage = false;
            this.currentFile = undefined;
            this.$emit('onFinaly');
        }
    },
    props: {
        area: String,
        editing: Boolean,
        loadingDialog: Boolean,
        backgroundImage: String
    }
};
</script>
