import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/editor',
      name: 'EditorPage',
      component: require('@/components/EditorPage').default
    },
    {
      path: '/export',
      name: 'PreviewBeforeSavePage',
      component: require('@/components/PreviewBeforeSave').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})