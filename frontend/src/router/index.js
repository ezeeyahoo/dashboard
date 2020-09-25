//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import Vue from 'vue'
import Router from 'vue-router'

import moment from 'moment-timezone'
import createRoutes from './routes'
import createGuards from './guards'

Vue.use(Router)

export default function createRouter ({ store, userManager }) {
  const zeroPoint = { x: 0, y: 0 }

  const routerOptions = {
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior (to, from, savedPosition) {
      return savedPosition || zeroPoint
    },
    routes: createRoutes(store)
  }

  /* automatic signout when token expires */
  let timeoutID
  store.watch((state, getters) => getters.userExpiresAt, expirationTime => {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    const currentTime = Date.now()
    if (expirationTime) {
      if (expirationTime > currentTime) {
        const delay = expirationTime - currentTime
        console.log(`automatic signout ${moment.duration(delay).humanize(true)}`)
        timeoutID = setTimeout(() => userManager.signout(), delay)
      } else {
        console.error('Expiration time of a new token is not expected to be in the past')
      }
    }
  })

  /* router */
  const router = new Router(routerOptions)

  /* navigation guards */
  const guards = createGuards(store, userManager)
  for (const guard of guards.beforeEach) {
    router.beforeEach(guard)
  }
  for (const guard of guards.afterEach) {
    router.afterEach(guard)
  }

  /* router error */
  router.onError(err => {
    console.error('Router error:', err)
    store.commit('SET_LOADING', false)
    store.commit('SET_ALERT', { type: 'error', message: err.message })
    router.push({ name: 'Error' })
  })

  return router
}
