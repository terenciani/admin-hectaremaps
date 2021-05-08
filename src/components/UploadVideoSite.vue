<template>
    <v-row id="upload-video-site">
        <v-col cols="12" sm="6" md="3">
            <vue-video :sources="videoSources"></vue-video>
        </v-col>
        <v-col cols="12" sm="6" md="9" class="d-flex align-center">
            <v-row>
                <v-col cols="12" v-if="!alterVideo">
                    <v-btn
                        class="teal white--text"
                        large
                        block
                        :disabled="loadingDialog || !editing"
                        @click="alterVideo = true"
                    >
                        Alterar Vídeo
                    </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                    <v-row>
                        <v-col cols="12" md="9" class="pb-0">
                            <v-file-input
                                label="Vídeo Promocional"
                                outlined
                                hint="O vídeo deve ser mp4"
                                accept="video/mp4"
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
                                :disabled="loadingDialog || !editing || !currentFile"
                                @click="upload()"
                            >
                                Atualizar
                                <v-icon right dark>mdi-cloud-upload</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" v-if="currentFile">
                    <v-progress-linear v-model="progress" color="light-blue" height="25" reactive>
                        <strong>{{ progress }} %</strong>
                    </v-progress-linear>
                </v-col>
            </v-row>
        </v-col>

        <v-snackbar v-model="response.active" :color="response.type">
            {{ response.message }}
            <template v-slot:action="{ attrs }">
                <v-btn :class="response.type" text v-bind="attrs" @click="response.active = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </v-row>
</template>
<script>
import config from '../../config';
import vueVideo from 'vue-video';
import UploadService from '@/service/UploadService';
export default {
    components: {
        vueVideo
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
            alterVideo: false
        };
    },
    computed: {
        videoSources() {
            if (this.src == '') return [];
            return [
                {
                    src: `${this.host}/assets/${this.src}`,
                    type: 'video/mp4'
                }
            ];
        }
    },
    methods: {
        selectFile(file) {
            this.progress = 0;
            this.currentFile = file;
        },
        upload() {
            if (!this.currentFile) {
                this.response = {
                    message: 'Por favor, selecione um vídeo no formato mp4!',
                    type: 'error',
                    active: true
                };
                return;
            }
            UploadService.uploadVideo(this.currentFile, event => {
                this.progress = Math.round((100 * event.loaded) / event.total);
            })
                .then(() => {
                    this.response = {
                        message: 'Vídeo enviado com sucesso!',
                        type: 'success',
                        active: true
                    };
                    this.init();
                })
                .catch(() => {
                    this.progress = 0;
                    this.response = {
                        message: 'Não foi possível enviar o vídeo. Tente mais tarde!',
                        type: 'error',
                        active: true
                    };
                    this.init();
                });
        },
        init() {
            this.alterVideo = false;
            this.currentFile = undefined;
            this.$emit('onFinaly');
        }
    },
    props: {
        editing: Boolean,
        loadingDialog: Boolean,
        src: String
    }
};
</script>
