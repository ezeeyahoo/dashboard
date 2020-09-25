//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import NewShootDetails from '@/components/NewShoot/NewShootDetails.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import noop from 'lodash/noop'
const EventEmitter = require('events')

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(Vuex)

// see issue https://github.com/vuejs/vue-test-utils/issues/974#issuecomment-423721358
global.requestAnimationFrame = cb => cb()

let vuetify

const projectList = [
  {
    metadata: {
      name: 'foo',
      namespace: 'garden-foo'
    },
    data: {
      owner: 'owner'
    }
  }
]

const store = new Vuex.Store({
  state: {
    namespace: 'garden-foo',
    cfg: {}
  },
  getters: {
    projectList: () => projectList,
    shootByNamespaceAndName: () => noop
  }
})

function createNewShootDetailsComponent () {
  const propsData = {
    userInterActionBus: new EventEmitter()
  }
  const wrapper = mount(NewShootDetails, {
    vuetify,
    propsData,
    store,
    computed: {
      sortedKubernetesVersionsList: () => []
    }
  })
  const machineImageComponent = wrapper.find(NewShootDetails)
  return machineImageComponent.vm
}

describe('NewShootDetails.vue', function () {
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('maximum shoot name length should depend on project name', function () {
    const shootDetails = createNewShootDetailsComponent()
    expect(shootDetails.maxShootNameLength).to.equal(18)
  })
})
