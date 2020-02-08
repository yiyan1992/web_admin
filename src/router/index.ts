import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login.vue";
import Home from '../views/Home.vue'
import DataSource from '../views/DataSource.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [
            {
                path: '/401',
                name: '401',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ '../views/401.vue')
            },
            {
                path: '/about',
                name: 'about',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
            },
            {
                path: '/dataSource',
                name: 'dataSource',
                component: DataSource
            }
        ]
    }

];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
