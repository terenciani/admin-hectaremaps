import AuthService from '../service/AuthService';
const adminItems = [
    {
        icon: 'mdi-home',
        text: 'Início',
        to: '/'
    },
    {
        icon: 'mdi-account',
        text: 'Modificar Perfil',
        to: '/profile'
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
];

const userItems = [
    {
        icon: 'mdi-home',
        text: 'Início',
        to: '/'
    },
    {
        icon: 'mdi-account',
        text: 'Modificar Perfil',
        to: '/profile'
    },
    {
        icon: 'mdi-cart',
        text: 'Contratar Plano',
        to: '/plancontract'
    },
    {
        icon: 'mdi-drone',
        text: 'Solicitações de Serviço',
        to: '/servicerequest'
    }
];

class DrawerItems {
    static async getItems() {
        let roleUser = await AuthService.getRoleUser();
        if (roleUser == 'ADMIN') return adminItems;
        return userItems;
    }
}
export default DrawerItems;
