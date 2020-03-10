import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import DataSource from '@/views/datasource/DataSourceView.vue'
import LoginView from '@/views/LoginView.vue'
import SysRoleView from "@/views/sys/SysRoleView.vue";
import CompanyView from "@/views/company/CompanyView.vue";
import SysMenuView from "@/views/sys/SysMenuView.vue";
import DepartmentView from "@/views/company/DepartmentView.vue";
import SysUserView from "@/views/sys/SysUserView.vue";
import ResetPwd from "@/views/ResetPwd.vue";
import SysAlgorithmView from "@/views/algorithm/SysAlgorithmView.vue";
import CompanyAlgorithmView from "@/views/algorithm/CompanyAlgorithmView.vue";
import ProjectView from "@/views/company/ProjectView.vue";
import PositionView from "@/views/company/PositionView.vue";
import ChartView from "@/views/chart/ChartView.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
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
            }, {
                path: '/sysRole',
                name: 'sysRole',
                component: SysRoleView
            }, {
                path: '/company',
                name: 'company',
                component: CompanyView
            }, {
                path: '/sysMenu',
                name: 'sysMenu',
                component: SysMenuView
            }, {
                path: '/department',
                name: 'department',
                component: DepartmentView
            }, {
                path: '/sysUser',
                name: 'sysUser',
                component: SysUserView
            }, {
                path: '/resetPwd',
                name: 'resetPwd',
                component: ResetPwd
            }, {
                path: '/sysAlgorithm',
                name: 'sysAlgorithm',
                component: SysAlgorithmView
            }, {
                path: '/companyAlgorithm',
                name: 'companyAlgorithm',
                component: CompanyAlgorithmView
            }, {
                path: '/project',
                name: 'project',
                component: ProjectView
            }, {
                path: '/position',
                name: 'position',
                component: PositionView
            }, {
                path: '/chart',
                name: 'chart',
                component: ChartView
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
