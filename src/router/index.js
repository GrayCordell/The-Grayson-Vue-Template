import { createRouter, createWebHistory } from 'vue-router'
import { BASE } from '~/app/environment/environment.config'
// noinspection ES6UnusedImports
// conditionally imported via /routes import. Based on vite config /routes
import routes from '/routes' // either ./routes.js or ./some-other-routes.js

// eslint-disable-next-line new-cap
export const router = new createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  base: `/${BASE}/`,
  routes,
})
export function getRouteParams() {
  return router.currentRoute?.params
}


// Vue Router navigation guard
// router.afterEach((_to, _from) => {
//   if (mySocket && flags.getIsSocketAllowed()) {
//   // Reconnect to Socket.IO after navigation
//     mySocket.connect()
//     if (!env.getIsTeacherDashboardApplication())
//       joinSocketActivity()
//   }
// })
router.beforeEach((to, from, next) => {
  // If the destination route does not have any query parameters
  // and the current route does, carry them over to the next route
  if (Object.keys(to.query).length === 0 && Object.keys(from.query).length > 0) {
    next({ name: to.name, query: from.query })
  }
  else {
    // Otherwise, just proceed as normal
    next()
  }
})

router.beforeEach((to, from, next) => {
  //
  // This is a simple disable route guard based on the url flags
  //
  // resources
  // if (!flags.getIsResourcesAllowed() && to.name === 'ResourceLibraryView') {
  //   return false // reject
  // }
  // if (!flags.getIsQuizAllowed() && to.name === 'CausalMapQuizView') {
  //   return false // reject
  // }
  return next() // accept
})


export default router
