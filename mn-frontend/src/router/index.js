import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import UserHome from '@/components/UserHome.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: 'Music NFT'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: 'Dashboard'
                },
                component: () => import('@/views/Welcome.vue')
            },
            {
                name: 'search',
                path: '/search',
                meta: {
                    title: 'Search Results'
                },
                component: () => import('@/views/Search.vue')
            },
            {
                name: 'welcomeAlbum',
                path: '/album',
                meta: {
                    title: 'Album Details'
                },
                component: () => import('@/views/Album.vue')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: 'User Login'
        },
        component: () => import('@/views/Login.vue')
    },
    {
        name: 'register',
        path: '/register',
        meta: {
            title: 'User Register'
        },
        component: () => import('@/views/Register.vue')
    },
    {
        name: 'me',
        path: '/me',
        meta: {
            title: 'User Profile'
        },
        component: UserHome,
        redirect: '/albums',
        children: [
            {
                name: 'albums',
                path: '/albums',
                meta: {
                    title: 'My Albums'
                },
                component: () => import('@/views/Me/Albums.vue')
            },
            {
                name: 'album',
                path: '/albums/album',
                meta: {
                    title: 'My Album Details'
                },
                component: () => import('@/views/Me/Album.vue')
            }
        ]
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: 'Not found'
        },
        component: () => import('@/views/404.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (router.hasRoute(to.name)) {
        document.title = to.meta.title;
        next()
    } else {
        next('/404')
    }
})

export default router