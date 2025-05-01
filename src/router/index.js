import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

const routes = [
  { path: '/', name: 'MainStars', component: App, meta: { screenIndex: 0 } },
  { path: '/tasks', name: 'Tasks', component: App, meta: { screenIndex: 1 } },
  { path: '/about', name: 'AboutUs', component: App, meta: { screenIndex: 2 } },
  { path: '/profile', name: 'Profile', component: App, meta: { screenIndex: 3 } },
  { path: '/withdraw', name: 'WithdrawScreen', component: App, meta: { screenIndex: 4 } },
  { path: '/:pathMatch(.*)*', redirect: '/' }, // Обработка неизвестных маршрутов
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;