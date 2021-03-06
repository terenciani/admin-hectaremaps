import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMask from 'v-mask';
import vuetify from './plugins/vuetify';
import VCurrencyField from 'v-currency-field';

import '@babel/polyfill';

Vue.use(VueMask);
Vue.use(VCurrencyField);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
