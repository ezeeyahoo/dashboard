//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { getCloudprofiles } from '@/utils/api'
import find from 'lodash/find'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  items: state => state.all,
  cloudProfileByName: (state) => (name) => {
    const predicate = item => item.metadata.name === name
    return find(state.all, predicate)
  }
}

// actions
const actions = {
  getAll: ({ commit, rootState }) => {
    return getCloudprofiles()
      .then(res => {
        commit('RECEIVE', res.data)
        return state.all
      })
  }
}

// mutations
const mutations = {
  RECEIVE (state, items) {
    state.all = items
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
