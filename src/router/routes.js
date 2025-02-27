import { BASE } from '../app/environment/environment.config'


// conditionally imported via /routes import. Based on vite config /routes
export const ROUTES = [
  //
  // {
  //   path: `/${BASE}/:module/front-page`,
  //   name: 'FrontView',
  //   meta: { noNavBar: true, noNotes: true },
  //   component: () => import('../views/FrontView.vue'),
  // },
  {
    path: `/${BASE}/`,
    name: 'BaseView1',
    component: () => import('../views/BaseView1.vue'),
  },
  { path: `/${BASE}`, redirect: `/${BASE}/` },

]
export default ROUTES
