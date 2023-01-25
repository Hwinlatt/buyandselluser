import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
  },
  {
    path: '/notifications',
    name: 'notification',
    component: () => import('../views/pages/NotificationView.vue'),
  },
  {
    path: '/verification',
    name: 'verification',
    component: () => import('../views/auth/VerificationView.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.state.user.email_verified_at && store.getters.isLogin) {
        next()
      }else {
        next('/login')
      }
    }
  },
  {
    path: '/addPost',
    name: 'addPost',
    component: () => import('../views/pages/AddPostView.vue'),
  },
  {
    path: '/editPost/:id',
    name: 'editPost',
    component: () => import('../views/pages/EditPostView.vue'),
  },
  {
    path: '/favorite',
    name: 'favoritePost',
    component: () => import('../views/pages/FavPostsView.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/pages/SearchView.vue'),
  },
  {
    path: '/profile',
    name: 'profileSetting',
    component: () => import('../views/pages/ProfileSettingView.vue'),
  },
  {
    path: '/profile/view/:id',
    name: 'profile',
    component: () => import('../views/profile/ProfileView.vue'),
  },
  {
    path: '/my_posts',
    name: 'my_posts',
    component: () => import('../views/MyPostView.vue'),
  },
  {
    path: '/posts/:id',
    name:'postInfo',
    component: () => import('../views/pages/PostInfoView.vue'),
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('../views/pages/CategoryView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/pages/404View.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})


router.beforeEach((to, from, next) => {
    if (to.path == '/login' || to.path == '/register') {
    if (store.getters.isLogin) {
      return next(from.path)
    }
  }
  if (!store.getters.isLogin && to.path != '/login' && to.path != '/register') {
    return next('/login');
  }
  next();
})

export default router
