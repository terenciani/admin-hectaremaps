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
            if (to.path != '/') {
                next({ path: '/' });
            } else next();
        } else if (!user.role == 'ADMIN') {
            if (to.matched.some(record => !record.meta.access.includes(user.role))) {
                // usuario NÃO tem permissão?
                next({ path: '/unauthorized' });
            } else next();
        } else next();
    } else next();
});
export default router;
