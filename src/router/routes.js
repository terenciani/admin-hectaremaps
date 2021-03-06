const routes = [
    {
        path: '/unauthorized',
        name: 'Acesso não autorizado'
    },
    {
        path: '/expired',
        name: 'Sessão expirada',
        component: () => import(`@/views/Expired.vue`)
    },
    {
        path: '/login',
        name: 'Página de Login',
        component: () => import(`@/views/Login.vue`)
    },
    {
        path: '/',
        name: 'Início',
        meta: {
            access: ['USER'],
            requiresAuth: true
        },
        component: () => import(`@/views/Home.vue`)
    },
    {
        path: '/plans',
        name: 'Gestão de Planos',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/Plans.vue`)
    },
    {
        path: '/services',
        name: 'Gestão de Serviços',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/Services.vue`)
    },
    {
        path: '/users',
        name: 'Gestão de Usuários',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/Users.vue`)
    },
    {
        path: '/freeplans',
        name: 'Liberação de Planos',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/FreePlans.vue`)
    },
    {
        path: '/site',
        name: 'Modificar Site',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/Site.vue`)
    },
    {
        path: '/profile',
        name: 'Modificar Perfil',
        meta: {
            access: ['USER'],
            requiresAuth: true
        },
        component: () => import(`@/views/Profile.vue`)
    },
    {
        path: '/plancontract',
        name: 'Contratar Plano',
        meta: {
            access: ['USER'],
            requiresAuth: true
        },
        component: () => import(`@/views/PlanContract.vue`)
    },
    {
        path: '/mycontracts',
        name: 'Meus Planos Contratados',
        meta: {
            access: ['USER'],
            requiresAuth: true
        },
        component: () => import(`@/views/MyContracts.vue`)
    },
    {
        path: '/myrequests',
        name: 'Solicitações de Serviço',
        meta: {
            access: ['USER'],
            requiresAuth: true
        },
        component: () => import(`@/views/MyRequests.vue`)
    },

    {
        path: '/localrequests',
        name: 'Solicitações de Serviço Local',
        meta: {
            access: ['USER'],
            requiresAuth: true
        },
        component: () => import(`@/views/LocalRequests.vue`)
    },
    {
        path: '/process',
        name: 'Processamento',
        meta: {
            requiresAuth: true
        },
        component: () => import(`@/views/Process.vue`)
    }
];
export default routes;
