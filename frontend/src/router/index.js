import Vue from "vue";
import VueRouter from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Settings from "../views/Settings.vue";
import UserManagement from "../views/UserManagement.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    // Auth routes (no navbar)
    {
        path: "/auth",
        component: AuthLayout,
        children: [
            {
                path: "/login",
                name: "Login",
                component: Login
            }
            // You can add more auth routes here like register, forgot-password, etc.
        ]
    },
    // Protected routes (with navbar)
    {
        path: "/",
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "/dashboard",
                name: "Dashboard",
                component: Dashboard
            },
            {
                path: "/users",
                name: "UserManagement",
                component: UserManagement,
                meta: {
                    title: "User Management"
                }
            },
            {
                path: "/profile",
                name: "Profile",
                component: Profile
            },
            {
                path: "/settings",
                name: "Settings",
                component: Settings
            }
        ]
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

// Auth guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (requiresAuth && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router;
