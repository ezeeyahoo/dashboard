//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import HintColorizer from '@/components/HintColorizer.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { VSelect, VTextField } from 'vuetify/lib'
Vue.use(Vuetify)

// see issue https://github.com/vuejs/vue-test-utils/issues/974#issuecomment-423721358
global.requestAnimationFrame = cb => cb()

describe('HintColorizer.vue', function () {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should be able to apply classname', async function () {
    const propsData = {
      hintColor: 'orange'
    }
    const wrapper = mount(HintColorizer, {
      vuetify,
      propsData
    })
    const colorizerComponent = wrapper.find(HintColorizer).vm
    expect(colorizerComponent.$el.className).to.contain('hintColor-orange')

    wrapper.setProps({ hintColor: 'cyan' })

    await Vue.nextTick()
    expect(colorizerComponent.$el.className).to.contain('hintColor-cyan')
    expect(colorizerComponent.$el.className).to.not.contain('hintColor-orange')

    wrapper.setProps({ hintColor: 'default' })

    await Vue.nextTick()
    expect(colorizerComponent.$el.className).to.not.contain('hintColor-cyan')
  })

  it('should not overwrite error color class for v-text-field', async function () {
    let data = () => {
      return {
        errorMessage: undefined
      }
    }
    const template = '<hint-colorizer hintColor="orange" ref="hintColorizer"><v-text-field :error-messages="errorMessage"></v-text-field></hint-colorizer>'
    let wrapper = mount({ template, data, components: { HintColorizer } }, {
      vuetify
    })
    expect(wrapper.vm.$refs.hintColorizer.$el.className).to.contain('hintColor-orange')

    data = () => {
      return {
        errorMessage: 'invalid'
      }
    }
    wrapper = mount({ template, data, components: { HintColorizer } }, {
      vuetify
    })
    expect(wrapper.vm.$refs.hintColorizer.$el.className).to.not.contain('hintColor-orange')
  })

  it('should not overwrite error color class for v-select', async function () {
    let data = () => {
      return {
        errorMessage: undefined
      }
    }
    const template = '<hint-colorizer hintColor="orange" ref="hintColorizer"><v-select :error-messages="errorMessage"></v-select></hint-colorizer>'
    let wrapper = mount({ template, data, components: { HintColorizer } }, {
      vuetify
    })
    expect(wrapper.vm.$refs.hintColorizer.$el.className).to.contain('hintColor-orange')

    data = () => {
      return {
        errorMessage: 'invalid'
      }
    }
    wrapper = mount({ template, data, components: { HintColorizer } }, {
      vuetify
    })
    expect(wrapper.vm.$refs.hintColorizer.$el.className).to.not.contain('hintColor-orange')
  })
})

describe('VSelect', function () {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should be able to overwrite v-select hint color class', function () {
    const hint = 'hint test'
    const propsData = {
      hint,
      'persistent-hint': true
    }
    const wrapper = mount(VSelect, {
      vuetify,
      propsData
    })
    const hintElement = wrapper.find('.v-messages__wrapper > .v-messages__message')
    expect(hintElement.text()).to.equal(hint)
  })
})

describe('VTextField', function () {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should be able to overwrite v-text-field hint color class', function () {
    const hint = 'hint test'
    const propsData = {
      hint,
      'persistent-hint': true
    }
    const wrapper = mount(VTextField, {
      vuetify,
      propsData
    })
    const hintElement = wrapper.find('.v-messages__wrapper > .v-messages__message')
    expect(hintElement.text()).to.equal(hint)
  })
})
