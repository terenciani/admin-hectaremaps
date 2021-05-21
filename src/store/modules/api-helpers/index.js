const state = () => ({
    helpers: {}
});

const mutations = {
    setHelpers(state, payload) {
        state.helpers = payload;
    }
}

const getters = {
    allHelpers: state => state.helpers,
    userHelpers: state => state.helpers.user
}

export default {
    namespaced: true,
    state,
    mutations,
    getters
}