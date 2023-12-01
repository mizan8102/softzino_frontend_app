import { createRouter, createWebHistory } from "vue-router";
import Login from '../views/Auth/Login.vue';
import store from "../store";
import Dashboard from "../views/Dashboard/Dashboard.vue";
import AppLayout from "../components/layouts/AppLayout.vue";
import ProductCreate from '../views/Product /ProductCreate.vue'
const routes = [
    {
        path: '/',
        redirect: '/app'
    },
    {
        path: '/app',
        name: 'app',
        redirect: '/app/dashboard',
        component: AppLayout,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'dashboard',
                name: 'app.dashboard',
                component: Dashboard
            },
            {
                path: 'product-create',
                name: 'product.create',
                component: ProductCreate
            },
        ]
    },

    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresGuest: true
        }
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.user.token) {
        next({ name: 'login' })
    } else if (to.meta.requiresGuest && store.state.user.token) {
        next({ name: 'app.dashboard' })
    } else {
        next();
    }

})

export default router;