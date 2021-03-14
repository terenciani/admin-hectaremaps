import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user/main';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user
    }
});
