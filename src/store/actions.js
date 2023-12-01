import axiosClient from "../axios";

export function getCurrentUser({ commit }, data) {
    return axiosClient.get('/user', data)
        .then(({ data }) => {
            commit('setUser', data?.data);
            return data;
        })
}

export function categories({ commit }, data) {
    // commit('setCategoryLoading', true);
    return axiosClient.get('/category', data)
        .then(({ data }) => {
            commit('setCategories', data?.data);
            // commit('setCategoryLoading', false);
            return data;
        })
}

export function login({ commit }, data) {
    return axiosClient.post('/login', data)
        .then(({ data }) => {
            commit('setUser', data?.data?.user);
            commit('setToken', data?.data?.token)
            return data;
        })
}


export function logout({ commit }) {
    return axiosClient.post('/logout')
        .then((response) => {
            commit('setToken', null)
            return response;
        })
}


export function createProduct({ commit }, data) {
    return axiosClient.post('/product', data)
        .then(({ data }) => {
            return data;
        })
}