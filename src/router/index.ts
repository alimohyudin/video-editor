import { createRouter, createWebHistory } from 'vue-router'
import CanvaView from '../views/CanvaView.vue'
import OutputView from '../views/OutputView.vue'
import DevView from '../views/DevView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'canva',
      component: CanvaView
    },
    {
      path: '/output/:file',
      name: 'output',
      component: OutputView
    },
    {
      path: '/dev/:file?',
      name: 'dev',
      component: DevView
    }
  ]
})

export default router
