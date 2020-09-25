//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { VMain } from 'vuetify/lib'
Vue.use(Vuetify)

describe('GPopper.vue', function () {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  describe('VMain', function () {
    it('v-main__wrap class should exist', function () {
      const wrapper = mount(VMain, { vuetify })
      const element = wrapper.find('.v-main__wrap')
      expect(element.constructor.name).to.be.eq('Wrapper') // if .v-main__wrap is not found the constructor name would be "ErrorWrapper"
    })
  })
})
