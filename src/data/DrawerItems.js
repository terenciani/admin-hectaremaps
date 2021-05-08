import AuthService from '../service/AuthService';
const adminItems = [
    {
        icon: 'mdi-cogs',
        text: 'Administração',
        heading: true,
        children: [
            {
                icon: 'mdi-slot-machine',
                text: 'Processamento',
                to: '/process'
            },
            {
                icon: 'mdi-check-decagram',
                text: 'Liberar Planos',
                to: '/freeplans'
            },
            {
                icon: 'mdi-sitemap',
                text: 'Gerenciar Planos',
                to: '/plans'
            },
            {
                icon: 'mdi-toolbox-outline',
                text: 'Gerenciar Serviços',
                to: '/services'
            },
            {
                icon: 'mdi-account-multiple',
                text: 'Gerenciar Usuários',
                to: '/users'
            },
            {
                icon: 'mdi-earth',
                text: 'Modificar Site',
                to: '/site'
            }
        ]
    }
];

const userItems = [
    {
        icon: 'mdi-home',
        text: 'Início',
        to: '/',
        heading: false
    },
    {
        icon: 'mdi-account',
        text: 'Modificar Perfil',
        to: '/profile',
        heading: false
    },
    {
        icon: 'mdi-cart',
        text: 'Contratar Plano',
        to: '/plancontract',
        heading: false
    },
    {
        icon: 'mdi-google-my-business',
        text: 'Histórico de Contratos',
        to: '/mycontracts',
        heading: false
    },
    {
        icon: 'mdi-drone',
        text: 'Solicitações de Serviço',
        to: '/myrequests',
        heading: false
    }
];

class DrawerItems {
    static async getItems() {
        let roleUser = await AuthService.getRoleUser();
        if (roleUser == 'ADMIN') return userItems.concat(adminItems);
        return userItems;
    }
}
export default DrawerItems;
