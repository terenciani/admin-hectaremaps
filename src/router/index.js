import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import AuthService from './../service/AuthService';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // precisa de autorização?
        let user = AuthService.getLoggedUser();
        if (user == null) {
            // usuario é nulo?
            next({ path: '/' });
        } else if (to.matched.some(record => record.meta.access)) {
            // requer permissão de acesso?
            if (to.matched.some(record => user.role != record.meta.access)) {
                // usuario NÃO tem permissão?
                next({ path: '/unauthorized' });
            } else next();
        } else next();
    } else next();
});
export default router;
