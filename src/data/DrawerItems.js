import AuthService from '../service/AuthService';
const userItems = [
    {
        icon: 'mdi-home',
        text: 'Dashboard',
        to: '/'
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
        to: '/user'
    },
    {
        icon: 'mdi-earth',
        text: 'Modificar Site',
        to: '/site'
    }
];

const adminItems = [
    {
        icon: 'mdi-home',
        text: 'Início',
        to: '/'
    },
    {
        icon: 'folder_special',
        text: 'Contratos e Licitação',
        children: []
    },
    {
        icon: 'folder_shared',
        text: 'Operacional',
        children: []
    },
    {
        icon: 'shopping_cart',
        text: 'Almoxarifado',
        children: []
    },
    {
        icon: 'ballot',
        text: 'Cadastros Gerais',
        children: []
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
