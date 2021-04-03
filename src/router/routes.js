const routes = [
    {
        path: '/unauthorized',
        name: 'Acesso não autorizado'
    },
    {
        path: '/expired',
        name: 'Sessão expirada'
    },
    {
        path: '/',
        name: 'Início',
        component: () => import(`@/views/Home.vue`)
    },
    {
        path: '/plans',
        name: 'Gestão de Planos',
        meta: {
            access: 'ADMIN',
            requiresAuth: true
        },
        component: () => import(`@/views/Plans.vue`)
    },
    {
        path: '/services',
        name: 'Gestão de Serviços',
        meta: {
            access: 'ADMIN',
            requiresAuth: true
        },
        component: () => import(`@/views/Services.vue`)
    },
    {
        path: '/users',
        name: 'Gestão de Usuários',
        meta: {
            access: 'ADMIN',
            requiresAuth: true
        },
        component: () => import(`@/views/Users.vue`)
    },
    {
        path: '/freeplans',
        name: 'Liberação de Planos',
        meta: {
            access: 'ADMIN',
            requiresAuth: true
        },
        component: () => import(`@/views/FreePlans.vue`)
    },
    {
        path: '/site',
        name: 'Modificar Site',
        meta: {
            access: 'ADMIN',
            requiresAuth: true
        },
        component: () => import(`@/views/Site.vue`)
    },
    {
        path: '/profile',
        name: 'Modificar Perfil',
        component: () => import(`@/views/Profile.vue`)
    },
    {
        path: '/plancontract',
        name: 'Contratar Plano',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/PlanContract.vue`)
    },
    {
        path: '/myplans',
        name: 'Meus Planos',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/Services.vue`)
    },
    {
        path: '/myrequests',
        name: 'Solicitações de Serviço',
        meta: {
            access: 'ADMIN',
            requiresAuth: true
        },
        component: () => import(`@/views/MyRequests.vue`)
    }
];
export default routes;
